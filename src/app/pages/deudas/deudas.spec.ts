import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Deudas } from './deudas';

describe('Deudas', () => {
  let component: Deudas;
  let fixture: ComponentFixture<Deudas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Deudas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Deudas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
