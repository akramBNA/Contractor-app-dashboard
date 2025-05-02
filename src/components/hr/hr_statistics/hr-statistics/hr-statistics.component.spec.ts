import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrStatisticsComponent } from './hr-statistics.component';

describe('HrStatisticsComponent', () => {
  let component: HrStatisticsComponent;
  let fixture: ComponentFixture<HrStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
