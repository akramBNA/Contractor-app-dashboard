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

  constructor(private salariesService: SalariesService) {}

  ngOnInit(): void {
    this.getAllSalaries();
  }

  getAllSalaries() {
    this.salariesService.getAllSalaries().subscribe((data: any) => {
      this.salaries_data = data.data;
      console.log(this.salaries_data);
    });
  }
  onPrint() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');

    if (popupWin && printContents) {
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Salaires des Employés</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f3f3f3;
            }
            h2 {
              text-align: center;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <h2>Salaires des Employés</h2>
          ${printContents}
        </body>
      </html>
    `);
      // popupWin.document.close();
    } else {
      alert('Impossible de générer le PDF.');
    }
  }
}
