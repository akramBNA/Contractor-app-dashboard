import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddHolidaysComponent } from '../add-holidays/add-holidays.component'; // adjust path
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('New holiday added, refresh the list');
      }
    });
  }
}
