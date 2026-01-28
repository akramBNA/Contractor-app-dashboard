import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractTypesComponent } from './add-contract-types.component';

describe('AddContractTypesComponent', () => {
  let component: AddContractTypesComponent;
  let fixture: ComponentFixture<AddContractTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContractTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContractTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
