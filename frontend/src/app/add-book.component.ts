import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from './book.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Component({
  selector: 'add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  private bookService = inject(BookService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  book = signal<Book>({ 
    title: '', 
    author: '', 
    genres: [], 
    pages: undefined as any, 
    rating: undefined as any, 
    reviews: [] 
  });
  
  genresInput = signal('');
  reviewsInput = signal('');
  isSubmitting = signal(false);

  addBook() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    const currentBook = { ...this.book() };
    
    currentBook.genres = this.genresInput().split(',').map(g => g.trim()).filter(Boolean);
    currentBook.reviews = this.reviewsInput()
      ? this.reviewsInput().split('\n').map(line => {
          const [name, ...body] = line.split(':');
          return { name: name.trim(), body: body.join(':').trim() };
        }).filter(r => r.name && r.body)
      : [];

    if (!currentBook.reviews.length) {
      this.notificationService.error('At least one review is required.');
      this.isSubmitting.set(false);
      return;
    }

    this.bookService.addBook(currentBook).subscribe({
      next: () => {
        this.notificationService.success('Book added successfully!');
        this.isSubmitting.set(false);
        this.router.navigate(['/books']);
      },
      error: err => {
        const msg = err.status === 403 
          ? 'You are not authorized to add a book.' 
          : (err.error?.error || 'Failed to add book.');
        this.notificationService.error(msg);
        this.isSubmitting.set(false);
      }
    });
  }
}
