import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProductosGerenComponent } from './ver-productos-geren';

describe('VerProductoGeren', () => {
  let component: VerProductosGerenComponent;
  let fixture: ComponentFixture<VerProductosGerenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerProductosGerenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerProductosGerenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
