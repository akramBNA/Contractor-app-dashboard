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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
    LoadingSpinnerComponent,
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
  page_size_options: number[] = [2, 5, 10, 20, 50];
  keywordControl: FormControl = new FormControl('');

  vehicleTypeTranslations: { [key: string]: string } = {
    car: 'Voiture',
    motorcycle: 'Moto',
    truck: 'Camion',
    pickup: 'Pick-up',
    van: 'Fourgonnette',
    bus: 'Bus',
    'construction vehicle': 'Engin de chantier',
    other: 'Autre',
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

    this.keywordControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value: string | null) => {
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
        this.swalService.showError(
          'Une erreur est survenue lors de la récupération des véhicules.'
        );
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
  }

  onDeletevehicle(vehicleId: number) {
    this.swalService.showConfirmation('Êtes-vous sûr de vouloir supprimer ce véhicule ?').then((result) => {
        if (result.isConfirmed) {
          this.isLoading = true;
          this.vehiclesService.deleteVehicle(vehicleId).subscribe({
            next: (response) => {
              if (response.success) {
                this.isLoading = false;
                this.swalService.showSuccess('Véhicule supprimé avec succès.');
                this.vehicles_data = this.vehicles_data.filter(
                  (v) => v.id !== vehicleId
                );

                this.total_count = this.total_count - 1;

                this.isEmpty = this.vehicles_data.length === 0;
              } else {
                this.swalService.showError('Échec de la suppression du véhicule. Veuillez réessayer.');
              }
            },
            error: () => {
              this.swalService.showError('Une erreur est survenue lors de la suppression du véhicule. Veuillez réessayer.');
            },
          });
        }
      });
  }

  clearSearch() {
    this.keywordControl.setValue('');
  }

  downloadPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const title = 'Liste des Véhicules';

    // Add title
    doc.setFontSize(18);
    doc.text(`Société SOHABA`, 14, 12);
    doc.setFontSize(12);
    doc.text(title, 14, 20);
    // doc.setFontSize(12);
    // doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

    const head = [[
      'Type de véhicule',
      'Marque',
      'Modèle',
      'Année',
      'Matricule',
      '1e mise en circulation',
      'N° VIN',
      'N° Assurance'
    ]];

    const body = this.vehicles_data.map(v => [
      this.translateVehicleType(v.vehicle_type),
      v.brand,
      v.model,
      v.model_year,
      v.licence_plate,
      v.circulation_date,
      v.vin_number,
      v.insurance_number
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} / ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`liste_vehicules_${new Date().toLocaleDateString()}.pdf`);
  }

}
