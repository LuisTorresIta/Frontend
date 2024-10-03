import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  clave: string = '';
  submitted: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // onSubmit() {
  //   this.submitted = true;

  //   if (!this.usuario) {
  //     this.errorMessage = 'Usuario is required.';
  //     return;
  //   }

  //   if (!this.clave) {
  //     this.errorMessage = 'Clave is required.';
  //     return;
  //   }

  //   this.authService.login(this.usuario, this.clave).subscribe({
  //     next: (response) => {
  //       if (response.message === 'Login successful') {
  //         console.log('Login successful, redirecting...');

  //         this.router.navigate(['/liquidation']);
  //       } else {
  //         this.errorMessage = 'Invalid credentials';
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error during login:', err);
  //       this.errorMessage = 'Error during login';
  //     }
  //   });
  // }

  onSubmit() {
    this.submitted = true;

    if (!this.usuario) {
      this.errorMessage = 'Usuario is required.';
      return;
    }

    if (!this.clave) {
      this.errorMessage = 'Clave is required.';
      return;
    }

    this.authService.login(this.usuario, this.clave).subscribe({
      next: (response) => {
        if (response.message === 'Login successful') {
          console.log('Login successful, redirecting...');
          this.router.navigate(['/liquidation']);
        } else {
          this.errorMessage = 'Invalid credentials'; // Este caso puede no ser necesario si el login falla en el `error`
        }
      },
      error: (err) => {
        console.error('Error during login:', err);
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas'; // Mensaje específico para credenciales inválidas
        } else {
          this.errorMessage = 'Error durante el inicio de sesión'; // Mensaje genérico para otros errores
        }
      }
    });
}

}
