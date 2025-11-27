import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProductosEmpComponent } from './ver-productos-emple';

describe('VerProductosEmple', () => {
  let component: VerProductosEmpComponent;
  let fixture: ComponentFixture<VerProductosEmpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProductosEmpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProductosEmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
