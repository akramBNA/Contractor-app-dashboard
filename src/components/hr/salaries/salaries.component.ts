import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SalariesService } from '../../../services/salaries.services';

@Component({
  selector: 'app-salaries',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.css',
})
export class SalariesComponent implements OnInit {
  salaries_data: any[] = [];
  
  constructor(
    private salariesService: SalariesService
  ) {};

  ngOnInit(): void {
    this.getAllSalaries();
  };

  getAllSalaries() {
    this.salariesService.getAllSalaries().subscribe((data: any) => {
      this.salaries_data = data.data;
      console.log(this.salaries_data);
      
    })
  };
  onPrint() {
    window.print();
  }
}
