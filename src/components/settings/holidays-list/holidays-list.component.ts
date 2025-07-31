import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddHolidaysComponent } from '../add-holidays/add-holidays.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { LoadingSpinnerComponent } from '../../../shared/loading-spinner/loading-spinner.component';
import { HolidaysService } from '../../../services/holidays.service';

@Component({
  selector: 'app-holidays-list',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './holidays-list.component.html',
  styleUrl: './holidays-list.component.css'
})
export class HolidaysListComponent {
  private dialog = inject(MatDialog);

  openAddHolidayModal() {
    const dialogRef = this.dialog.open(AddHolidaysComponent, {
      width: 'auto',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        //
      }
    });
  }
}
