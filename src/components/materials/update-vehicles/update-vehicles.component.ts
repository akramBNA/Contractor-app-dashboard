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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-update-vehicles',
  imports: [CommonModule, LoadingSpinnerComponent, MatSelectModule, MatDatepickerModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './update-vehicles.component.html',
  styleUrl: './update-vehicles.component.css'
})
export class UpdateVehiclesComponent {
  isLoading = false;
  vehicle_types_data: any[] = [];
  vehicle_data: any = {};
  vehicleForm: any;

  vehicleTypeTranslations: { [key: string]: string } = {
    car: 'Voiture',
    motorcycle: 'Moto',
    truck: 'Camion',
    pickup: 'Pick-up',
    van: 'Fourgon',
    bus: 'Bus',
    'construction vehicle': 'Engin de chantier',
    other: 'Autre'
  };

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
    this.getVehicleTypes();
    const veh_id_num = Number(window.location.pathname.split('/').pop());
    
    if (!isNaN(veh_id_num)) {      
      this.getVehicle(veh_id_num);
    } else {
      this.swal.showError('ID du véhicule invalide.');
    }
  };

  async getVehicleTypes() {
    this.isLoading = true;
    this.vehicleTypesService.getAllVehicleTypes().subscribe({
      next: (res) => {
        this.vehicle_types_data = res.data;
        this.vehicle_types_data = this.vehicle_types_data.map((vt: any) => ({
          ...vt,
          vehicle_type_fr: this.vehicleTypeTranslations[vt.vehicle_type] || vt.vehicle_type
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.swal.showError('Une erreur est survenue lors de la récupération des types de véhicules. Veuillez réessayer.');
      }
    });
  };
  
  async getVehicle(ID: any) {
    this.isLoading = true;
    this.vehiclesService.getVehicleById(ID).subscribe({
      next: (res) => {
        console.log("res ===> ", res);
        
        if(res.success) {
          this.vehicle_data = res.data;
          console.log("vehicle data ===> ", this.vehicle_data);
          this.vehicleForm.patchValue({
            vehicle_type_id: this.vehicle_data.vehicle_type_id,
            brand: this.vehicle_data.brand,
            model: this.vehicle_data.model,
            model_year: this.vehicle_data.model_year,
            licence_plate: this.vehicle_data.licence_plate,
            circulation_date: this.vehicle_data.circulation_date,
            vin_number: this.vehicle_data.vin_number,
            insurance_number: this.vehicle_data.insurance_number,
          });
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.swal.showError('Une erreur est survenue lors de la récupération des données du véhicule. Veuillez réessayer.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.swal.showError('Une erreur est survenue lors de la récupération des données. Veuillez réessayer.');
      }
    });
  }

  onUpdate(id:any) {    
    if (this.vehicleForm.invalid) {
      this.swal.showWarning('Veuillez remplir tous les champs obligatoires.');
      return;
    };
    this.isLoading = true;
    
    this.vehiclesService.updateVehicle(parseInt(id), this.vehicleForm.value).subscribe({
      next: (res) => {
        if(res.success) {
          this.isLoading = false;
          this.swal.showSuccess('Véhicule mis à jour avec succès.');
        } else {
          this.isLoading = false;
          this.swal.showError('Une erreur est survenue lors de la mise à jour du véhicule. Veuillez réessayer.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.swal.showError('Une erreur est survenue lors de la mise à jour du véhicule. Veuillez réessayer.');
      }
    });
  };
}
