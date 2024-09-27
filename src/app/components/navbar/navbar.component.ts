import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: any = null;
  showUserInfo: boolean = false;

  constructor(private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.authService.getUsuarioObservable().subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToChangePassword() {
    this.showUserInfo = false;
    this.router.navigate(['/change-password']);
  }

}
