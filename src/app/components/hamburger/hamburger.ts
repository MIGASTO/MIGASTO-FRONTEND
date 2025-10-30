import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hamburger',
  standalone: true,
  imports: [],
  templateUrl: './hamburger.html',
  styleUrl: './hamburger.scss'
})
export class Hamburger implements OnInit {
  @Input() initialState: boolean = false;
  @Input() closed?: Observable<void>;
  @Output() trigger: EventEmitter<void> = new EventEmitter<void>();

  active: boolean = false;

  ngOnInit(): void {
    this.active = this.initialState || false;

    if (this.closed) {
      this.closed.subscribe(() => this.active = false);
    }
  }

  triggered(): void {
    this.active = !this.active;
    this.trigger.emit();
  }

}