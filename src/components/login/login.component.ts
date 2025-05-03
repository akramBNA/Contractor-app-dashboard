import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', Validators.required],
    });
  }

  onSubmit() {    
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/main-page']);
        },
        error: (err) => {
          this.loginError = err.error.message || 'Login failed';
        },
      });
    }
  }
}
