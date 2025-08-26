import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth-service';
import { LoginRequest } from '../../../models/auth/login-request.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup
  isLoading = false
  errorMessage = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }
  onSubmit(): void {
    if (!this.loginForm.valid) return 
    this.isLoading = true
    this.errorMessage = ""

    const credentials: LoginRequest = this.loginForm.value
    this.authService.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/home'])
      },
      error: (error) => {
        this.errorMessage = error.error?.message || "Login failed"
        this.isLoading = false
      },
      complete: () => {
        this.isLoading = false
      }
    })
  }
}
