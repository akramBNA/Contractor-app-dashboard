import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.services';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SwalService } from '../../shared/Swal/swal.service';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatIconModule, ReactiveFormsModule, LoadingSpinnerComponent],
})
export class SignupComponent {
  isLoading: boolean = false;
  user_data: any = [];
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private swalService: SwalService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  hidePassword = true;
  hideConfirmPassword = true;

  get passwordMismatch(): boolean {
    const { user_password, confirmPassword } = this.signupForm.value;
    return user_password !== confirmPassword && this.signupForm.touched;
  }

  onSubmit(): void {
    this.isLoading = true;
    if (this.signupForm.invalid || this.passwordMismatch) {
      this.isLoading = false;
      this.swalService.showWarning('Votre formulaire est invalide ou les mots de passe ne correspondent pas.');
    }
    
    this.userService.signupWithEmployeeEmail(this.signupForm.value).subscribe((data: any) => {
        if (data.success) {
          this.isLoading = false;
          this.swalService.showSuccess('Votre compte a été créé avec succès!').then(() => {
            this.signupForm.reset();
            this.router.navigate(['/']);
          });
        } else {
          this.isLoading = false;

          if (data.message === 'Email not found in employee records.') {
            this.swalService.showError("L'email n'est pas enregistré dans les données des employés.");
          } else {
            if(data.message === 'A user with this email already exists.') {
              this.swalService.showError("Un utilisateur avec cet email existe déjà.");
            }else{
              this.swalService.showError("Échec lors de l'inscription. Veuillez réessayer.");
            }
          }
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
