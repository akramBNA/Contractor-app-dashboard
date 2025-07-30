import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../../../shared/loading-spinner/loading-spinner.component';
import { MatInputModule } from '@angular/material/input';
import { h } from '../../../../../../node_modules/@angular/material/module.d-CyLvt0Fz';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepicker } from '@angular/material/datepicker';
import { LeavesService } from '../../../../../services/leaves.services';
import { SwalService } from '../../../../../shared/Swal/swal.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-request-leaves',
  imports: [
    LoadingSpinnerComponent,
    MatInputModule,
    h,
    MatAutocompleteModule,
    MatDatepicker,
  ],
  templateUrl: './request-leaves.component.html',
  styleUrl: './request-leaves.component.css',
})
export class RequestLeavesComponent {
  isLoading: boolean = false;
  requestLeavesForm: FormGroup;

  constructor(
    private leaveServices: LargestContentfulPaint,
    private swalService: SwalService,
    private fb: FormBuilder
  ) {
    this.requestLeavesForm = this.fb.group({
      employee_id: [0, Validators.required],
      leave_type_id: [0, Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(){
    
  }
}
