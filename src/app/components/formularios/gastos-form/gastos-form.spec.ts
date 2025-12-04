import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GastosForm } from './gastos-form';

describe('GastosForm', () => {
  let component: GastosForm;
  let fixture: ComponentFixture<GastosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GastosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GastosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
