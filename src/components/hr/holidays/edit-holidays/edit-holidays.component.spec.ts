import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHolidaysComponent } from './edit-holidays.component';

describe('EditHolidaysComponent', () => {
  let component: EditHolidaysComponent;
  let fixture: ComponentFixture<EditHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditHolidaysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
