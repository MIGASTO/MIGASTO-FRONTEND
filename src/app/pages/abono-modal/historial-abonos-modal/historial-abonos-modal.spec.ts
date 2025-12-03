import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialAbonosModal } from './historial-abonos-modal';

describe('HistorialAbonosModal', () => {
  let component: HistorialAbonosModal;
  let fixture: ComponentFixture<HistorialAbonosModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialAbonosModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialAbonosModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
