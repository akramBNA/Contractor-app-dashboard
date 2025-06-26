import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-salaries',
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.css',
})
export class SalariesComponent implements OnInit {
  salaries_data: any[] = [];
  
  constructor() {}
  ngOnInit(): void {}
  onPrint() {
    window.print();
  }
}
