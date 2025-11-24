import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { hrStatsService } from '../../../services/hr_stats.services';
import { SwalService } from '../../../shared/Swal/swal.service';

@Component({
  selector: 'app-hr-stats',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './hr-stats.component.html',
  styleUrls: ['./hr-stats.component.css'],
})
export class HrStatsComponent implements OnInit {
  birthdays: any[] = [];
  isLoading: boolean = true;

  constructor(
    private hrService: hrStatsService,
    @Inject(SwalService) private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getBirthdays();
  }

  getBirthdays() {
    this.isLoading = true;
    this.hrService.getAllEmployeesBirthdaysForThisMonth().subscribe({
      next: (response) => {
        this.birthdays = response.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading birthdays', err);
        this.isLoading = false;
        this.swalService.showError('Une erreur est survenue lors du chargement des anniversaires.');
      },
    });
  };
}
