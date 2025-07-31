import { Component, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { AddHolidaysComponent } from '../add-holidays/add-holidays.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { HolidaysService } from '../../../services/holidays.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker';

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

  constructor(
    private holidaysService: HolidaysService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchHolidays(this.selected_year);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.calendar.updateTodaysDate();
    });
  }

  refreshCalendar() {
    if (this.calendar) {
      const currentActiveDate = this.calendar.activeDate;
      this.calendar.activeDate = new Date(currentActiveDate);
    }
  }
  

  openAddHolidayModal() {
    const dialogRef = this.dialog.open(AddHolidaysComponent, {
      width: 'auto',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        //
      }
    });
  }

  fetchHolidays(year: number) {
    this.isLoading = true;
    this.isEmpty = false;
    this.holidaysService.getAllHolidays(year).subscribe((data: any) => {
      if (data.success) {
        this.isEmpty = data.data.length === 0;
        // this.holidays_data = [];
        
        this.isLoading = false;
        this.holidays_data = data.data;
        this.holidayDates = this.holidays_data.map((h: any) => new Date(h.holiday_date));
        this.refreshCalendar();

        console.log(" holidayDates: ", this.holidayDates);
        console.log('Holidays data: ', this.holidays_data);
      }
    });
  }

  highlightHolidays = (date: Date): string => {
    const dateStr = this.formatDateLocal(date);
    const isHoliday = this.holidayDates.some((d) => this.formatDateLocal(d) === dateStr);
    return isHoliday ? 'holiday-highlight' : '';
  };

  private formatDateLocal(date: Date): string {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }


  holidayEdit(holidayId: number) {}

  holidayDelete(holidayId: number) {}
}
