import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcularNominaComponent } from './calcular-nomina';

describe('CalcularNomina', () => {
  let component: CalcularNominaComponent;
  let fixture: ComponentFixture<CalcularNominaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcularNominaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcularNominaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
