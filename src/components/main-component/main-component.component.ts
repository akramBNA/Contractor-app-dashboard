import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-component',
  imports: [RouterOutlet, RouterLink],
  standalone: true,
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css'
})
export class MainComponentComponent {
  current_year: number = new Date().getFullYear();
  my_web_resume_link: string = "https://akrambna.github.io/My-Web-Resume/"
}
