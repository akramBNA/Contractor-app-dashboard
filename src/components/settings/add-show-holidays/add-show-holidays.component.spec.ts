import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShowHolidaysComponent } from './add-show-holidays.component';

describe('AddShowHolidaysComponent', () => {
  let component: AddShowHolidaysComponent;
  let fixture: ComponentFixture<AddShowHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShowHolidaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShowHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
