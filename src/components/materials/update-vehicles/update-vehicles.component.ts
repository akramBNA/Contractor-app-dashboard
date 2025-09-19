import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingSpinnerComponent } from "../../../shared/loading-spinner/loading-spinner.component";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiclesService } from '../../../services/vehicles.services';
import { VehicleTypesService } from '../../../services/vehicle_types.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-vehicles',
  imports: [CommonModule, LoadingSpinnerComponent, MatSelectModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './update-vehicles.component.html',
  styleUrl: './update-vehicles.component.css'
})
export class UpdateVehiclesComponent {
  isLoading = false;
  vehicle_types_data: any[] = [];
  vehicle_data: any[] = [];
  vehicleForm: any;

  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private vehicleTypesService: VehicleTypesService,
    private swal: SwalService,
    private route: ActivatedRoute
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
    const veh_id = window.location.pathname.split('/').pop();
    
    this.getVehicleTypes();
    const veh_id_num = Number(veh_id);
    if (!isNaN(veh_id_num)) {
      this.getVehicles(veh_id_num);
    } else {
      this.swal.showError('ID du véhicule invalide.');
    }
  };

  getVehicleTypes() {
    this.isLoading = true;
    this.vehicleTypesService.getAllVehicleTypes().subscribe({
      next: (res) => {
        this.vehicle_types_data = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.swal.showError('Une erreur est survenue lors de la récupération des types de véhicules. Veuillez réessayer.');
      }
    });
  };
  
  getVehicles(ID: any) {
    this.isLoading = true;
    this.vehiclesService.getVehicleById(ID).subscribe({
      next: (res) => {
        this.vehicle_data = res.data;
        console.log("vehicle data ===> ", this.vehicle_data);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.swal.showError('Une erreur est survenue lors de la récupération des données. Veuillez réessayer.');
      }
    });
  }

  onUpdate() {};
}
