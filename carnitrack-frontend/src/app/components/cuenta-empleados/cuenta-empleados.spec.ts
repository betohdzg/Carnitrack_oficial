import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentasEmpleadosComponent } from './cuenta-empleados';

describe('CuentasEmpleadoss', () => {
  let component: CuentasEmpleadosComponent;
  let fixture: ComponentFixture<CuentasEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CuentasEmpleadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuentasEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
