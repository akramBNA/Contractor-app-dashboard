import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { SwalService } from '../../shared/Swal/swal.service';
import { AuthService } from '../../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  imports: [ReactiveFormsModule, CommonModule, LoadingSpinnerComponent],
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
    private router: Router,
    private swalService: SwalService
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
          this.isLoading = false;
          this.authService.saveToken(response.token);
          this.authService.setUserData(response);

          const userRole = sessionStorage.getItem('user_role') ?? '';
          if (userRole === 'super_admin' || userRole === 'admin') {
            this.router.navigate(['/main-page/hr/hr-stats']);
          } else {
            this.router.navigate(['/main-page/hr/my-leaves']);
          }

        },
        error: (err) => {
          this.isLoading = false;
          this.swalService.showError('Erreur de connexion. Veuillez vérifier vos informations.').then(() => {
            this.loginForm.reset();
          });
        },
      });
    }
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
