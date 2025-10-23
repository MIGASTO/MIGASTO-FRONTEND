import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresosForm } from './ingresos-form';

describe('IngresosForm', () => {
  let component: IngresosForm;
  let fixture: ComponentFixture<IngresosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresosForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
