import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponentComponent } from '../components/main-component/main-component.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MainComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'contractor-app-dashboard';
}
