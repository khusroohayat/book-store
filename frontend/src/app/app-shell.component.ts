import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppShellComponent {
  public auth = inject(AuthService);
  public notificationService = inject(NotificationService);

  logout() {
    this.auth.logout();
    this.notificationService.success('Logged out successfully');
  }
}
