import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AddHolidaysComponent } from '../../add-holidays/add-holidays.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { HolidaysService } from '../../../../services/holidays.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditHolidaysComponent } from '../edit-holidays/edit-holidays.component';
import { SwalService } from '../../../../shared/Swal/swal.service';


@Component({
  selector: 'app-holidays-list',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    LoadingSpinnerComponent,
    MatIconModule,
    MatCalendar,
    MatSelectModule,
    FormsModule, 
    ReactiveFormsModule
],
  templateUrl: './holidays-list.component.html',
  styleUrl: './holidays-list.component.css',
})
export class HolidaysListComponent {
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;
  
  isLoading: boolean = false;
  isEmpty: boolean = false;
  holidays_data: any[] = [];
  selected_year: number = new Date().getFullYear();

  today = new Date();
  holidayDates: Date[] = [];
  years: number[] = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  constructor(
    private holidaysService: HolidaysService,
    private dialog: MatDialog,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.fetchHolidays(this.selected_year);
  };

  ngAfterViewInit() {
    setTimeout(() => {
      this.calendar.updateTodaysDate();
    });
  };

  selectYear(year: number) {
    this.selected_year = year;
    this.fetchHolidays(year);

    const newDate = new Date(year, 0, 1);
    if (this.calendar) {
      this.calendar.activeDate = newDate;
      this.today = newDate;
    }
  }


  refreshCalendar() {
    if (this.calendar) {
      const currentActiveDate = this.calendar.activeDate;
      this.calendar.activeDate = new Date(currentActiveDate);
    }
  };

  fetchHolidays(year: number) {
    this.isLoading = true;
    this.isEmpty = false;
    this.holidaysService.getAllHolidays(year).subscribe((data: any) => {
      if (data.success) {
        this.isEmpty = data.data.length === 0;
        this.isLoading = false;
        this.holidays_data = data.data;
        this.years = data.years;
        this.holidayDates = this.holidays_data.map((h: any) => new Date(h.holiday_date));
        
        this.calendar.updateTodaysDate();  
      }
    });
  };

  highlightHolidays = (date: Date): string => {
    const dateStr = this.formatDateLocal(date);
    const isHoliday = this.holidayDates.some((d) => this.formatDateLocal(d) === dateStr);
    return isHoliday ? 'holiday-highlight' : '';
  };

  private formatDateLocal(date: Date): string {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  };

    openAddHolidayModal() {
    const dialogRef = this.dialog.open(AddHolidaysComponent, {
      width: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {};
    });
  };

  onCalendarYearChange(date: Date | null) {
    if (!date) return;
    const year = date.getFullYear();
    if (year !== this.selected_year) {
      this.selected_year = year;
      this.fetchHolidays(year);
    }
  };

  holidayEdit(holidayId: number) {
    const holiday = this.holidays_data.find(h => h.holiday_id === holidayId);
    if (!holiday) return;

    const dialogRef = this.dialog.open(EditHolidaysComponent, {
      width: '420px',
      disableClose: true,
      data: { holiday }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.isLoading = true;
      if (result) {
        this.holidaysService.updateHoliday(holidayId, result).subscribe(res => {
          if (res.success) {
            this.isLoading = false;
            this.swalService.showSuccess('Jour férié mis à jour avec succès').then(() => {
              this.fetchHolidays(this.selected_year);
            });
          } else {
            this.isLoading = false;
            this.swalService.showError('Échec de la mise à jour du jour férié');
          }
        });
      }
    });
  };

  holidayDelete(holidayId: number) {};
}
