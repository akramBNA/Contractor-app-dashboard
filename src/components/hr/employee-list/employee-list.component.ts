import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  imports: [CommonModule, MatTableModule],
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  // Dummy data for the employee table
  employees = [
    { matricule: 'EMP001', name: 'John Doe', gender: 'Male', address: '123 Street', email: 'john.doe@example.com', leaveBalance: 10, joinDate: '2021-01-01', department: 'Sales', groupWork: 'A' },
    { matricule: 'EMP002', name: 'Jane Smith', gender: 'Female', address: '456 Avenue', email: 'jane.smith@example.com', leaveBalance: 12, joinDate: '2020-06-15', department: 'HR', groupWork: 'B' },
    // Add more employees as needed
  ];

  totalEmployees = 100;
  totalMaleEmployees = 60;
  totalFemaleEmployees = 40;
  totalNewEmployees = 15;

  displayedColumns: string[] = ['matricule', 'name', 'gender', 'address', 'email', 'leaveBalance', 'joinDate', 'department', 'groupWork', 'actions'];
  dataSource = new MatTableDataSource(this.employees);
  
  searchTerm: string = '';

  ngOnInit(): void {
    // Optionally, perform additional setup (e.g., setting up sorting, pagination)
  }

  searchEmployee(event: Event): void {
    const input = event.target as HTMLInputElement;  // Cast event.target to HTMLInputElement
    this.searchTerm = input.value;  // Access value property
    this.dataSource.filter = input.value.trim().toLowerCase();
  }
  
}
