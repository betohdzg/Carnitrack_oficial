import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoTemperatura } from './monitoreo-temperatura';

describe('MonitoreoTemperatura', () => {
  let component: MonitoreoTemperatura;
  let fixture: ComponentFixture<MonitoreoTemperatura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonitoreoTemperatura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoreoTemperatura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
