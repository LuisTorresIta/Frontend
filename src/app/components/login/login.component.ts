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
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.usuario) {
      this.errorMessage = 'Usuario is required.';
      this.isLoading = false;
      return;
    }

    if (!this.clave) {
      this.errorMessage = 'Clave is required.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.usuario, this.clave).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.message === 'Login successful') {
          console.log('Login successful, redirecting...');
          this.router.navigate(['/liquidation']);
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error during login:', err);
        if (err.status === 401) {
          this.errorMessage = 'Credenciales inválidas';
        } else {
          this.errorMessage = 'Error durante el inicio de sesión';
        }
      }
    });
  }

}
