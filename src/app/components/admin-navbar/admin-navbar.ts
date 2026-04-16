import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './admin-navbar.html',
})
export class AdminNavbarComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    isMobileMenuOpen = false;

    constructor() {}

    logout() {
      this.authService.logout();
      this.closeMenu();
    }

    toggleMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMenu() {
      this.isMobileMenuOpen = false;
    }
}