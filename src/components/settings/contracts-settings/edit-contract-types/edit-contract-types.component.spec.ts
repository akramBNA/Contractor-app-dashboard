import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractTypesComponent } from './edit-contract-types.component';

describe('EditContractTypesComponent', () => {
  let component: EditContractTypesComponent;
  let fixture: ComponentFixture<EditContractTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditContractTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditContractTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
