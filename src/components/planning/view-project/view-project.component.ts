import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProjectsService } from '../../../services/projects.services';
import { ModalAddTaskComponent } from '../add-tasks/add-tasks.component';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../../shared/Swal/swal.service';
import { DayPilot, DayPilotSchedulerComponent, DayPilotModule } from '@daypilot/daypilot-lite-angular';
import { MatDialog } from '@angular/material/dialog';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatInputModule } from "@angular/material/input";

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-view-project',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent, DayPilotModule, MatInputModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css',
})
export class ViewProjectComponent {
  @ViewChild('scheduler') scheduler!: DayPilotSchedulerComponent;

  project_data: any = null;
  isLoading = false;

  private resourceColors: { [resourceId: string]: { backColor: string; barColor: string; fontColor: string; } } = {};
  private colorPalette = [
    { back: '#1e90ff', bar: '#0f62fe', font: '#ffffff' },
    { back: '#28a745', bar: '#1c7c3b', font: '#ffffff' },
    { back: '#ffc107', bar: '#e0a800', font: '#000000' },
    { back: '#dc3545', bar: '#a71d2a', font: '#ffffff' },
    { back: '#6610f2', bar: '#520dc2', font: '#ffffff' }
  ];

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
    resources: [],
    onBeforeEventRender: (args) => {
      const resourceId = args.data.resource;

      if (resourceId && this.resourceColors[resourceId]) {
        const colors = this.resourceColors[resourceId];
        args.data.backColor = colors.backColor;
        args.data.barColor = colors.barColor;
        args.data.fontColor = colors.fontColor;
      } else {
        args.data.backColor = '#cccccc';
        args.data.barColor = '#999999';
        args.data.fontColor = '#000000';
      }
    },
    onEventClick: (args) => {
      const event = args.e;
      const name = event.data.text;
      this.swalService.showAlert(`${name}`, 'Détails du Tâche');
    }
  };

  constructor(
    private projectsService: ProjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private swalService: SwalService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const project_id = Number(this.route.snapshot.paramMap.get('id'));
    if (project_id) {
      this.getProjectById(project_id);
    }
  }

  ngAfterViewInit(): void {}

  addOneDay(dateStr: string): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  getProjectById(project_id: number): void {
    this.isLoading = true;
    this.projectsService.getProjectById(project_id).subscribe((data: any) => {
      this.isLoading = false;
      if (data.success) {
        this.project_data = data.data;
        this.scheduler.control.update({
          startDate: DayPilot.Date.parse(this.project_data.start_date, 'yyyy-MM-dd'),
        });
        
        const dynamicResources = this.project_data.tasks.map((task: any, index: number) => {
        const id = String(task.task_id);
        const palette = this.colorPalette[index % this.colorPalette.length];
        this.resourceColors[id] = {
          backColor: palette.back,
          barColor: palette.bar,
          fontColor: palette.font
        };
        return { id, name: task.task_name };
      });

        const dynamicEvents = this.project_data.tasks.map((task: any) => ({
          id: String(task.task_id),
          resource: String(task.task_id),
          start: task.start_date,
          end: this.addOneDay( task.end_date),
          text: task.description
        }));

        this.scheduler.control.update({
          resources: dynamicResources,
          events: dynamicEvents
        });

      } else {
        this.swalService.showError('Erreur lors de la récupération du projet.').then(() => this.router.navigate(['/main-page/planning/show-project']));
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

  exportToPDF() {
    const schedulerElement = document.getElementById('print-section');
    if (!schedulerElement) return;

    html2canvas(schedulerElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('planning.pdf');
    });
  }

  openAddTaskModal(): void {
    const project_id = this.project_data?.project_id;
    const dialogRef = this.dialog.open(ModalAddTaskComponent, {
      data: {project_id: project_id},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  getPriorityLabel(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'Faible';
      case 'Medium':
        return 'Moyenne';
      case 'High':
        return 'Élevée';
      default:
        return 'Inconnue';
    }
  }

}
