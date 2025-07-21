import { Component, ViewChild } from '@angular/core';
import { ProjectsService } from '../../../services/projects.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { DayPilot, DayPilotSchedulerComponent, DayPilotModule } from '@daypilot/daypilot-lite-angular';

@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DayPilotModule],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css',
})
export class ViewProjectComponent {
  @ViewChild('scheduler') scheduler!: DayPilotSchedulerComponent;

  project_data: any = null;
  isLoading = false;

  YearSchedulerConfig: DayPilot.SchedulerConfig = {
    timeHeaders: [
      { groupBy: 'Month' },
      { groupBy: 'Day', format: 'd' }
    ],
    scale: 'Day',
    days: DayPilot.Date.today().daysInYear(),
    startDate: DayPilot.Date.today().firstDayOfYear(),
    businessBeginsHour: 0,
    businessEndsHour: 0,
    businessWeekends: true,
    eventHeight: 40,
    timeRangeSelectedHandling: 'Enabled',
    onTimeRangeSelected: async (args) => {
      const scheduler = args.control;
      const modal = await DayPilot.Modal.prompt('Create a new event:', 'Event 1');
      scheduler.clearSelection();
      if (!modal.canceled) {
        scheduler.events.add({
          start: args.start,
          end: args.end,
          id: DayPilot.guid(),
          resource: args.resource,
          text: modal.result
        });
      }
    },
    resources: [
      { name: 'Resource 1', id: 'R1' },
      { name: 'Resource 2', id: 'R2' },
      { name: 'Resource 3', id: 'R3' },
      { name: 'Resource 4', id: 'R4' },
      { name: 'Resource 5', id: 'R5' }
    ],
    onBeforeEventRender: (args) => {
      switch (args.data.resource) {
        case 'R1':
          args.data.backColor = '#1e90ff';
          args.data.barColor = '#0f62fe';
          args.data.fontColor = '#ffffff';
          break;
        case 'R2':
          args.data.backColor = '#28a745';
          args.data.barColor = '#1c7c3b';
          args.data.fontColor = '#ffffff';
          break;
        case 'R3':
          args.data.backColor = '#ffc107';
          args.data.barColor = '#e0a800';
          args.data.fontColor = '#000000';
          break;
        case 'R4':
          args.data.backColor = '#dc3545';
          args.data.barColor = '#a71d2a';
          args.data.fontColor = '#ffffff';
          break;
        case 'R5':
          args.data.backColor = '#6610f2';
          args.data.barColor = '#520dc2';
          args.data.fontColor = '#ffffff';
          break;
        default:
          args.data.backColor = '#cccccc';
          args.data.barColor = '#999999';
          args.data.fontColor = '#000000';
      }
    }
  };

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    const project_id = Number(this.route.snapshot.paramMap.get('id'));
    if (project_id) {
      this.getProjectById(project_id);
    }
  }

  ngAfterViewInit(): void {
    const events = [
      {
        id: '1',
        resource: 'R1',
        start: '2025-07-22',
        end: '2025-07-27',
        text: 'Project Phase A'
      },
      {
        id: '2',
        resource: 'R2',
        start: '2025-08-01',
        end: '2025-09-01',
        text: 'Phase B - Development'
      },
      {
        id: '3',
        resource: 'R3',
        start: '2025-01-05',
        end: '2025-02-14',
        text: 'Phase C - Design'
      },
      {
        id: '4',
        resource: 'R4',
        start: '2025-04-02',
        end: '2025-04-07',
        text: 'Phase D - QA'
      },
      {
        id: '5',
        resource: 'R5',
        start: '2025-05-06',
        end: '2025-06-22',
        text: 'Phase E - Deployment'
      }
    ];

    this.scheduler.control.update({ events });
    // this.scheduler.control.scrollTo('2025-07-19');
  }

  getProjectById(project_id: number): void {
    this.isLoading = true;
    this.projectsService.getProjectById(project_id).subscribe((data: any) => {
      this.isLoading = false;
      if (data.success) {
        this.project_data = data.data;
      } else {
        this.swalService.showError('Erreur lors de la récupération du projet.')
          .then(() => this.router.navigate(['/main-page/planning/show-project']));
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/main-page/planning/show-project']);
  }

  printScheduler() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const printWindow = window.open('', '', 'width=1920,height=1080');
    if (printWindow && printContents) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Planning du Projet</title>
            <style>
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .daypilot-scheduler-main {
                  overflow: visible !important;
                  height: auto !important;
                }
              }

              /* Landscape print mode */
              @page {
                size: landscape;
                margin: 10mm;
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 3000);
    }
  }

}
