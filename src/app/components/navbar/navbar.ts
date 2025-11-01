import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  imports: [RouterModule, ],
  styleUrls: ['./navbar.css'],
})
export class Navbar{
  isMenuOpen = false;

  closeMenu() {
    this.isMenuOpen = false;
  }
}
