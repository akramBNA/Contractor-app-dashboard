import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVehiclesComponent } from './update-vehicles.component';

describe('UpdateVehiclesComponent', () => {
  let component: UpdateVehiclesComponent;
  let fixture: ComponentFixture<UpdateVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVehiclesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
