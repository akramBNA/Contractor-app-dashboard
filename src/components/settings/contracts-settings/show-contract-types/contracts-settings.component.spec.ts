import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsSettingsComponent } from './contracts-settings.component';

describe('ContractsSettingsComponent', () => {
  let component: ContractsSettingsComponent;
  let fixture: ComponentFixture<ContractsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
