import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoCuota } from './pago-cuota';

describe('PagoCuota', () => {
  let component: PagoCuota;
  let fixture: ComponentFixture<PagoCuota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagoCuota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoCuota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
