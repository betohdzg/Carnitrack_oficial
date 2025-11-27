import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosExtrasNomComponent } from './bono-extras-nom';

describe('BonoExtrasNom', () => {
  let component: BonosExtrasNomComponent;
  let fixture: ComponentFixture<BonosExtrasNomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonosExtrasNomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonosExtrasNomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
