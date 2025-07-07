import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SalariesService } from '../../../services/salaries.services';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-salaries',
  imports: [CommonModule, MatIconModule, MatButtonModule, MatPaginatorModule, LoadingSpinnerComponent],
  templateUrl: './salaries.component.html',
  styleUrl: './salaries.component.css',
})
export class SalariesComponent implements OnInit {

  isLoading: boolean = false;
  salaries_data: any[] = [];
  limit: number = 20;
  offset: number = 0;
  keyword: string = '';
  total: number = 0;

  constructor(private salariesService: SalariesService) {}

  ngOnInit(): void {
    this.getAllSalaries(this.limit, this.offset, this.keyword);
  }

  getAllSalaries(limit: number, offset: number, keyword: string): void {
    this.isLoading = true;
    this.salariesService.getAllSalaries(limit, offset, keyword).subscribe((res: any) => {
      if( res.success){
        this.isLoading = false;
        this.salaries_data = res.data;
        this.total = res.attributes?.total || 0;
      }
    });
  }

  onPageChange(event: any): void {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getAllSalaries(this.limit, this.offset, this.keyword);
  }

  onPrint() {
    const printContents = document.getElementById('print-section')?.innerHTML;
    const popupWin = window.open('', '_blank', 'width=1920,height=1080');

    if (popupWin && printContents) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <title>Salaires des Employés</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
              th { background-color: #f3f3f3; }
              h2 { text-align: center; margin-bottom: 20px; }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <h2>Salaires des Employés</h2>
            ${printContents}
          </body>
        </html>
      `);
    } else {
      alert('Impossible de générer le PDF.');
    }
  }
}

