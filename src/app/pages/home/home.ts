import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Dashboard } from "../../components/dashboard/dashboard";
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [RouterModule, Dashboard, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  resumen = {
    ingresos: 1800,
    gastos: 1250,
  };

  get balance() {
    return this.resumen.ingresos - this.resumen.gastos;
  }
}
