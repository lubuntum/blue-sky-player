import { User } from "../user/user.model";

export interface AuthResponse {
    token: string,
    user: User
}