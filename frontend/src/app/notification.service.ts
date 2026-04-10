import { Injectable, signal } from '@angular/core';

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 0;

  get notifications$() {
    return this.notifications.asReadonly();
  }

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) {
    const id = this.nextId++;
    const notification: Notification = { id, message, type };
    
    this.notifications.update(n => [...n, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  remove(id: number) {
    this.notifications.update(n => n.filter(x => x.id !== id));
  }
}
