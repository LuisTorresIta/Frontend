import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  clave: string = '';
  showPassword: boolean = false;
  validatingToastId: number | null = null;

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.usuario || !this.clave) {
      this.toastr.warning(!this.usuario ? 'Por favor ingrese su usuario' : 'Por favor ingrese su contraseña', '', {
        toastClass: 'ngx-toastr custom-toast'
      });
      return;
    }

    // Si hay una notificación de validación activa la cerramos
    if (this.validatingToastId) {
      this.toastr.clear(this.validatingToastId);
    }

    this.validatingToastId = this.toastr.info('Validando información...', 'Procesando', {
      disableTimeOut: true,
      closeButton: false,
      toastClass: 'ngx-toastr custom-toast'
    }).toastId;

    this.authService.login(this.usuario, this.clave).subscribe({
      next: (response) => {
        if (this.validatingToastId !== null) {
          this.toastr.clear(this.validatingToastId);
          this.validatingToastId = null;
        }

        if (response.message === 'Login successful') {
          this.toastr.success('Inicio de sesión exitoso.', 'Bienvenido', {
            toastClass: 'ngx-toastr custom-toast'
          });
          this.router.navigate(['/liquidation']);
        } else {
          this.toastr.error('La información ingresada no es correcta, por favor intente de nuevo.', 'Error', {
            toastClass: 'ngx-toastr custom-toast'
          });
        }
      },
      error: (err) => {
        if (this.validatingToastId !== null) {
          this.toastr.clear(this.validatingToastId);
          this.validatingToastId = null;
        }

        if (err.status === 401) {
          this.toastr.error('La información ingresada no es correcta, por favor intente de nuevo.', 'Error', {
            toastClass: 'ngx-toastr custom-toast'
          });
        } else {
          this.toastr.error('Error durante el inicio de sesión', 'Error', {
            toastClass: 'ngx-toastr custom-toast'
          });
        }
      }
    });
  }
}
