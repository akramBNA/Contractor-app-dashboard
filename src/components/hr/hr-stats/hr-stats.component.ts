import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { hrStatsService } from '../../../services/hr_stats.services';
import { SwalService } from '../../../shared/Swal/swal.service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-hr-stats',
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './hr-stats.component.html',
  styleUrls: ['./hr-stats.component.css'],
})
export class HrStatsComponent implements OnInit {
  birthdays: any[] = [];
  genderData: any = {};
  ongoingLeaves: any[] = [];

  isLoading: boolean = true;
  
  @ViewChild('genderChart') genderChartRef!: ElementRef<HTMLCanvasElement>;
  genderChart!: Chart;

  translateLeaveType(type: string): string {
    const translations: any = {
      "Annual Leave": "Congé Annuel",
      "Sick Leave": "Congé Maladie",
      "Maternity Leave": "Congé Maternité",
      "Unpaid Leave": "Congé Sans Solde",
    };

    return translations[type] || type;
  }

  constructor(
    private hrService: hrStatsService,
    @Inject(SwalService) private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getHrStats();
  }

  getHrStats() {
    this.isLoading = true;
    this.hrService.getAllEmployeesBirthdaysForThisMonth().subscribe({
      next: (response) => {
        this.birthdays = response.data.birthdaysData || [];
        this.genderData = response.data.genderDistributionData || {};
        this.ongoingLeaves = response.data.ongoingLeaves || [];
        this.isLoading = false;

        setTimeout(() => {
          this.initGenderChart();
        }, 200);

      },
      error: (err) => {
        this.isLoading = false;
        this.swalService.showError('Une erreur est survenue lors du chargement des anniversaires.');
      },
    });
  };

  initGenderChart() {
    if (!this.genderChartRef) return;

    const male = Number(this.genderData.male_count || 0);
    const female = Number(this.genderData.female_count || 0);

    if (this.genderChart) this.genderChart.destroy();

    this.genderChart = new Chart(this.genderChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Homme', 'Femme'],
        datasets: [
          {
            data: [male, female],
            backgroundColor: ['#3B82F6', '#EC4899'],
            hoverOffset: 6
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 14 }
            }
          }
        }
      }
    });
  };

  calculateLeaveDuration(start: string, end: string): number {
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    return Math.floor(diff / (1000 * 3600 * 24)) + 1;
  };

}
