import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescuentosNomComponent } from './descuentos-nom';

describe('DescuentosNom', () => {
  let component: DescuentosNomComponent;
  let fixture: ComponentFixture<DescuentosNomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescuentosNomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescuentosNomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
