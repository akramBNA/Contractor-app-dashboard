import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrStatsComponent } from './hr-stats.component';

describe('HrStatsComponent', () => {
  let component: HrStatsComponent;
  let fixture: ComponentFixture<HrStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
