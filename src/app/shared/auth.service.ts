import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario, LoginResponse, ChangePasswordPayload, ChangePasswordResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private usuarioLogueado: Usuario | null = null;
  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  login(usuario: string, clave: string): Observable<LoginResponse> {
    const body = { usuario, clave };

    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, body)
      .pipe(
        tap(response => {
          if (response.message === 'Login successful') {
            this.isLoggedIn = true;
            this.usuarioLogueado = {
              usuario: response.usuario,
              empresa: response.empresa
            };

            localStorage.setItem('currentUser', JSON.stringify(this.usuarioLogueado));
            this.usuarioSubject.next(this.usuarioLogueado);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.isLoggedIn = false;
    this.usuarioLogueado = null;
    localStorage.removeItem('currentUser');
    this.usuarioSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUsuarioLogueado(): Usuario | null {
    return this.usuarioLogueado;
  }

  getUsuarioObservable(): Observable<Usuario | null> {
    return this.usuarioSubject.asObservable();
  }

  getPeriodos(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/periodos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  changePassword(payload: ChangePasswordPayload): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${environment.apiUrl}/change-password`, payload)
      .pipe(
        tap(response => {
          console.log(response);
          if (response.message === 'Contraseña cambiada exitosamente') {
            this.logout();

          }
        }),
        catchError(this.handleError)
      );
  }


  saveRecord(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/saveRecord`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.usuarioLogueado = JSON.parse(storedUser);
      this.isLoggedIn = true;
      this.usuarioSubject.next(this.usuarioLogueado);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error && error.error.message) {
      // Error del servidor 
      errorMessage = error.error.message;
    } else {
      // Otros errores
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage
    }));
  }

}
