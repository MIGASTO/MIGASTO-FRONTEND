import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMovimientos } from './admin-movimientos';

describe('AdminMovimientos', () => {
  let component: AdminMovimientos;
  let fixture: ComponentFixture<AdminMovimientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMovimientos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMovimientos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
