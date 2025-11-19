import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterModule],
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  isMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  closeMenu() {
    console.log('closeMenu called');
    this.isMenuOpen = false;
  }

  logout() {
    console.log('logout called');
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenu();
  }
}
