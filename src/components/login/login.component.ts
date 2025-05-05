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
import Swal from 'sweetalert2';

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  current_year: number = new Date().getFullYear();
  loginForm: FormGroup;
  loginError: string = '';
  isLoading = false;

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
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          this.authService.saveToken(response.token);
          // localStorage.setItem('token', response.token);
          this.router.navigate(['/main-page']);
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Oops!',
            text: 'Failed to log in! Please verify your information.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#d33',
          }).then(() => {
            this.loginForm.reset();
          });
        },
      });
    }
  }
}
