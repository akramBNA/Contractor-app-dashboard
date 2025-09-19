import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormBuilder, Validators } from '@angular/forms';
import { VehiclesService } from '../../../services/vehicles.services';
import { VehicleTypesService } from '../../../services/vehicle_types.services';
import { SwalService } from '../../../shared/Swal/swal.service';

@Component({
  selector: 'app-update-vehicles',
  imports: [CommonModule, LoadingSpinnerComponent, MatSelectModule, MatDatepickerModule],
  templateUrl: './update-vehicles.component.html',
  styleUrl: './update-vehicles.component.css'
})
export class UpdateVehiclesComponent {
  isLoading = false;
  vehicle_types_data: any[] = [];
  vehicles_data: any[] = [];
  vehicleForm: any;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private vehicleTypesService: VehicleTypesService,
    private swal: SwalService
  ) {
    this.vehicleForm = this.fb.group({
      vehicle_type_id: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      model_year: ['', [Validators.required, Validators.min(1900)]],
      licence_plate: ['', Validators.required],
      circulation_date: ['', Validators.required],
      vin_number: ['', Validators.required],
      insurance_number: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // this.getVehicleTypes();
    // this.getVehicles();
  };

  getVehicleTypes() {};
  
  getVehicles() {}

  onUpdate() {};
}
