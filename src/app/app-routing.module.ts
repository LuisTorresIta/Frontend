import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LiquidationComponent } from './components/liquidation/liquidation.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EstadoDeCuentaComponent } from './components/estado-de-cuenta/estado-de-cuenta.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'liquidation', component: LiquidationComponent, canActivate: [AuthGuard] },  
  { path: 'estado-de-cuenta', component: EstadoDeCuentaComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/login' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
