import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,

    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,

    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],

  selector: 'app-view-attendance',
  templateUrl: './view-attendance.component.html',
  styleUrls: ['./view-attendance.component.css'],
})
export class ViewAttendanceComponent implements OnInit {
  isMobile: boolean = false;
  isEmpty: boolean = false;

  limit: number = 20;
  offset: number = 0;

  keyword = new FormControl('');

  selectedPeriod: string = 'daily';

  present_employees_count: number = 4;
  absent_employees_count: number = 2;
  late_employees_count: number = 2;
  total_employees_count: number = 8;

  attendanceList: any[] = [
    {
      matricule: 'EMP001',
      name: 'Ahmed',
      lastname: 'Ben Ali',
      phone: '20 123 456',
      email: 'ahmed.benali@example.com',
      status: 'present',
    },

    {
      matricule: 'EMP002',
      name: 'Mohamed',
      lastname: 'Trabelsi',
      phone: '21 234 567',
      email: 'mohamed.trabelsi@example.com',
      status: 'late',
    },

    {
      matricule: 'EMP003',
      name: 'Sami',
      lastname: 'Gharbi',
      phone: '22 345 678',
      email: 'sami.gharbi@example.com',
      status: 'present',
    },

    {
      matricule: 'EMP004',
      name: 'Yassine',
      lastname: 'Ben Salem',
      phone: '23 456 789',
      email: 'yassine.bensalem@example.com',
      status: 'absent',
    },

    {
      matricule: 'EMP005',
      name: 'Karim',
      lastname: 'Jaziri',
      phone: '24 567 890',
      email: 'karim.jaziri@example.com',
      status: 'present',
    },

    {
      matricule: 'EMP006',
      name: 'Walid',
      lastname: 'Mansouri',
      phone: '25 678 901',
      email: 'walid.mansouri@example.com',
      status: 'late',
    },

    {
      matricule: 'EMP007',
      name: 'Hatem',
      lastname: 'Khelifi',
      phone: '26 789 012',
      email: 'hatem.khelifi@example.com',
      status: 'present',
    },

    {
      matricule: 'EMP008',
      name: 'Oussama',
      lastname: 'Ayari',
      phone: '27 890 123',
      email: 'oussama.ayari@example.com',
      status: 'absent',
    },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    // Detect mobile screen
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    // Search by employee name / lastname
    this.keyword.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string | null) => {
        this.searchEmployees((value ?? '').trim());
      });
  }

  searchEmployees(keyword: string): void {
    if (!keyword) {
      this.resetAttendanceList();

      return;
    }

    const searchValue = keyword.toLowerCase();

    const filteredEmployees = this.attendanceList.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchValue) ||
        employee.lastname.toLowerCase().includes(searchValue),
    );

    this.attendanceList = filteredEmployees;

    this.isEmpty = filteredEmployees.length === 0;
  }

  resetAttendanceList(): void {
    // Temporary solution for dummy data.
    // Later this will call the backend.

    this.attendanceList = [
      {
        matricule: 'EMP001',
        name: 'Ahmed',
        lastname: 'Ben Ali',
        phone: '20 123 456',
        email: 'ahmed.benali@example.com',
        status: 'present',
      },

      {
        matricule: 'EMP002',
        name: 'Mohamed',
        lastname: 'Trabelsi',
        phone: '21 234 567',
        email: 'mohamed.trabelsi@example.com',
        status: 'late',
      },

      {
        matricule: 'EMP003',
        name: 'Sami',
        lastname: 'Gharbi',
        phone: '22 345 678',
        email: 'sami.gharbi@example.com',
        status: 'present',
      },

      {
        matricule: 'EMP004',
        name: 'Yassine',
        lastname: 'Ben Salem',
        phone: '23 456 789',
        email: 'yassine.bensalem@example.com',
        status: 'absent',
      },

      {
        matricule: 'EMP005',
        name: 'Karim',
        lastname: 'Jaziri',
        phone: '24 567 890',
        email: 'karim.jaziri@example.com',
        status: 'present',
      },

      {
        matricule: 'EMP006',
        name: 'Walid',
        lastname: 'Mansouri',
        phone: '25 678 901',
        email: 'walid.mansouri@example.com',
        status: 'late',
      },

      {
        matricule: 'EMP007',
        name: 'Hatem',
        lastname: 'Khelifi',
        phone: '26 789 012',
        email: 'hatem.khelifi@example.com',
        status: 'present',
      },

      {
        matricule: 'EMP008',
        name: 'Oussama',
        lastname: 'Ayari',
        phone: '27 890 123',
        email: 'oussama.ayari@example.com',
        status: 'absent',
      },
    ];

    this.isEmpty = false;
  }

  clearSearch(): void {
    this.keyword.setValue('');

    this.offset = 0;

    this.resetAttendanceList();
  }

  onPeriodChange(): void {
    console.log('Selected period:', this.selectedPeriod);

    /*
  Later:

  daily
    -> getDailyAttendance()

  weekly
    -> getWeeklyAttendance()

  yearly
    -> getYearlyAttendance()
*/
  }

  onPageChange(event: PageEvent): void {
    this.limit = event.pageSize;

    this.offset = event.pageIndex * event.pageSize;
  }
}
