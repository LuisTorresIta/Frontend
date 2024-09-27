import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  currentUser: any;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUsuarioLogueado();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  changePassword() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son requeridos.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    this.authService.changePassword(this.currentUser.usuario, this.currentPassword, this.newPassword)
      .subscribe({
        next: (response: any) => {
          this.successMessage = response.message || 'Contraseña cambiada exitosamente';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cambiar la contraseña:', error);
          if (error.status === 400) {
            this.errorMessage = error.error.message || 'La contraseña actual es incorrecta.';
          } else {
            this.errorMessage = 'Error al cambiar la contraseña: ' + (error.error.message || error.message);
          }
        }
      });
  }
}
