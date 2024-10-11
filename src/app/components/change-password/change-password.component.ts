import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangePasswordPayload, ChangePasswordResponse } from 'src/app/models/user.model';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

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

  showPassword = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(private authService: AuthService, private router: Router, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUsuarioLogueado();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  changePassword() {
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toastr.error('Todos los campos son requeridos.', 'Error', { toastClass: 'ngx-toastr custom-toast' });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Las contraseñas no coinciden.', 'Error', { toastClass: 'ngx-toastr custom-toast' });
      return;
    }

    const payload: ChangePasswordPayload = {
      usuario: this.currentUser.usuario,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.authService.changePassword(payload)
      .subscribe({
        next: (response: ChangePasswordResponse) => {
          this.toastr.success(response.message || 'Contraseña cambiada exitosamente', 'Éxito', { toastClass: 'ngx-toastr custom-toast' });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cambiar la contraseña:', error);
          if (error.status === 400) {
            this.toastr.error(error.error?.message || 'La contraseña actual es incorrecta.', 'Error', { toastClass: 'ngx-toastr custom-toast' });
          } else {
            this.toastr.error('Error al cambiar la contraseña, ' + (error.error?.message || error.message), 'Error', { toastClass: 'ngx-toastr custom-toast' });
          }
        }
      });
  }
}
