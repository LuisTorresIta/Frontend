import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private usuarioLogueado: any = null;
  private usuarioSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  login(usuario: string, clave: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    const body = JSON.stringify({ usuario, clave });

    return this.http.post('http://localhost:3000/login', body, { headers })
      .pipe(
        tap((response: any) => {
          if (response.message === 'Login successful') {
            this.isLoggedIn = true;
            this.usuarioLogueado = {
              usuario: response.usuario,
              empresa: response.empresa
            };

            localStorage.setItem('currentUser', JSON.stringify(this.usuarioLogueado));

            this.usuarioSubject.next(this.usuarioLogueado);
            console.log('Usuario logueado:', this.usuarioLogueado);
          }
        })
      );
  }

  logout() {
    this.isLoggedIn = false;
    this.usuarioLogueado = null;
    localStorage.removeItem('currentUser');
    this.usuarioSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUsuarioLogueado() {
    if (!this.usuarioLogueado) {
      this.usuarioLogueado = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    return this.usuarioLogueado;
  }

  getUsuarioObservable(): Observable<any> {
    return this.usuarioSubject.asObservable();
  }

  getPeriodos(): Observable<any> {
    return this.http.get('http://localhost:3000/periodos');
  }

  changePassword(usuario: string, currentPassword: string, newPassword: string): Observable<any> {
    const payload = {
      usuario: usuario,
      currentPassword: currentPassword,
      newPassword: newPassword
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('http://localhost:3000/change-password', payload, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }


}
