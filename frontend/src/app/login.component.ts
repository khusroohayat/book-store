import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: res => {
        this.auth.setToken(res.token);
        this.isSubmitting = false;
        this.router.navigate(['/books']);
      },
      error: err => {
        this.error = err.error?.error || 'Login failed.';
        this.isSubmitting = false;
      }
    });
  }
}
