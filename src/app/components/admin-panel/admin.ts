import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule, Navbar, MatSidenavModule, MatListModule, MatIconModule, MatDividerModule, MatCardModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class Admin {}