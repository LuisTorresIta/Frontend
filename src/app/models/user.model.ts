export interface Usuario {
    usuario: string;
    empresa: string;
}

export interface LoginResponse {
    message: string;
    usuario: string;
    empresa: string
}

export interface ChangePasswordPayload {
    usuario: string;
    currentPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    message: string;
  }
  