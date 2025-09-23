import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  success = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.error = '';
    this.success = '';
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        this.success = 'Registration successful! You can now log in.';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: err => {
        this.error = err.error?.error || 'Registration failed.';
        this.isSubmitting = false;
      }
    });
  }
}
