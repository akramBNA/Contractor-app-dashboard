import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { VehiclesService } from '../../../services/vehicles.services';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicles-list',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css',
})
export class VehiclesListComponent {
  isLoading: boolean = false;
  isEmpty: boolean = false;
  limit: number = 20;
  offset: number = 0;
  keyword: string = '';
  vehicles_data: any[] = [];
  total_count: number = 0;
  page_size_options: number[] = [5, 10, 20, 50];
  keywordControl: FormControl = new FormControl('');

  vehicleTypeTranslations: { [key: string]: string } = {
    car: 'Voiture',
    motorcycle: 'Moto',
    truck: 'Camion',
    pickup: 'Pick-up',
    van: 'Fourgonnette',
    bus: 'Bus',
    'construction vehicle': 'Engin de chantier',
    other: 'Autre'
  };

  translateVehicleType(type: string): string {
    return this.vehicleTypeTranslations[type] || type;
  }

  constructor(
    private vehiclesService: VehiclesService,
    private swalService: SwalService,
    private router: Router
  ) {}
  ngOnInit() {
    this.fetchVehiclesData(this.limit, this.offset, this.keyword ?? '');

    this.keywordControl.valueChanges.pipe(debounceTime(500)).subscribe((value: string | null) => {
        this.offset = 0;
        this.fetchVehiclesData(this.limit, this.offset, (value ?? '').trim());
      });
  }

  fetchVehiclesData(lim: number, off: number, key: string) {
    this.isLoading = true;
    this.isEmpty = false;
    this.keyword = key;

    this.vehiclesService.getAllVehicles(lim, off, key).subscribe({
      next: (response) => {                
        if (response.success) {
          this.isLoading = false;
          this.vehicles_data = response.data;
          this.total_count = response.attributes.total;
          this.isEmpty = this.vehicles_data.length === 0;
        } else {
          this.isLoading = false;
          this.isEmpty = true;
          this.vehicles_data = [];
          this.total_count = 0;
        }
      },
      error: () => {
        this.isLoading = false;
        this.swalService.showError('Une erreur est survenue lors de la récupération des véhicules.');
      },
    });
  }

  onPageChange(event: any) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.fetchVehiclesData(this.limit, this.offset, this.keyword ?? '');
  }

  onEditvehicle(vehicleId: number) {
        this.router.navigate(['/main-page/material/update-vehicles', vehicleId]);
  };

  onDeletevehicle(vehicleId: number) {}

  clearSearch() {
    this.keywordControl.setValue('');
  }
}
