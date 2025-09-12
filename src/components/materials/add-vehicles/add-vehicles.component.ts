import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { VehiclesService } from '../../../services/vehicles.services';

@Component({
  selector: 'app-add-vehicles',
  imports: [CommonModule, LoadingSpinnerComponent, MatInputModule, MatSelectModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './add-vehicles.component.html',
  styleUrl: './add-vehicles.component.css'
})
export class AddVehiclesComponent {
  isLoading = false;
  vehicleForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private vehiclesService: VehiclesService,
    private swal: SwalService
  ) {
    this.vehicleForm = this.fb.group({
      vehicle_type: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      model_year: ['', [Validators.required, Validators.min(1900)]],
      licence_plate: ['', Validators.required],
      circulation_date: ['', Validators.required],
      vin_number: ['', Validators.required],
      insurance_number: ['', Validators.required],
    });
  }

  async onSubmitVehicle() {
    if (this.vehicleForm.invalid) {
      this.swal.showWarning('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.isLoading = true;

    this.vehiclesService.addVehicle(this.vehicleForm.value).subscribe({
      next: (response) => {
        if(response.success){
          this.swal.showSuccess('Véhicule ajouté avec succès!');
          this.vehicleForm.reset();
          this.isLoading = false;
        } else{
          this.isLoading = false;
          this.swal.showError("Erreur lors de l'ajout du véhicule.");
        }
      },
      error: (err) => {
        console.error(err);
        this.swal.showError("Erreur lors de l'ajout du véhicule.");
        this.isLoading = false;
      }
    });
  }
}
