import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../models/user/user.model';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../models/auth/login-request.model';
import { AuthResponse } from '../../models/auth/auth-response.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = "http://dummy:8080/api/auth"
  private currentUserSubject = new BehaviorSubject<User | null>(null)
  public currentUser$ = this.currentUserSubject.asObservable()

  constructor(
    private http: HttpClient,
    private router: Router
  ) {this.initializeAuth()}
  private initializeAuth(): void {
    const token = this.getToken()
    const user = this.getUserFromStorage()
    if (token && user) this.currentUserSubject.next(user)
  }
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response)
          this.currentUserSubject.next(response.user)
        })
      )
  }
  logout(): void {
    window.localStorage.removeItem('auth_token')
    window.localStorage.removeItem('user')
    this.currentUserSubject.next(null)
    this.router.navigate(['/login'])
  }
  isAuthentificated(): boolean {
    const token = this.getToken()
    return !!token && !this.isTokenExpired()
  }
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('auth_token')
    }
    return null
  }
  private setSession(response: AuthResponse): void {
    window.localStorage.setItem('auth_token', response.token)
    window.localStorage.setItem('user', JSON.stringify(response.user))
  }
  private getUserFromStorage(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userStr = window.localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }
  private isTokenExpired(): boolean {
    const token = this.getToken()
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}
