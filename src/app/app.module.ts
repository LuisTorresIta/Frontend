import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HttpHeadersInterceptor } from './interceptors/http.interceptor';
import { EstadoDeCuentaComponent } from './components/estado-de-cuenta/estado-de-cuenta.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LiquidationComponent,
    NavbarComponent,
    LoginComponent,
    ChangePasswordComponent,
    EstadoDeCuentaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      progressBar: true,
      timeOut: 3000
    })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpHeadersInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
