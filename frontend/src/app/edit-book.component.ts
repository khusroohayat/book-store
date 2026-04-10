import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from './book.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  book = signal<Book | null>(null);
  error = signal<string | null>(null);
  genresInput = '';
  reviewsInput = '';
  isSubmitting = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(id).subscribe({
        next: b => {
          this.book.set({
            ...b,
            pages: b.pages ?? undefined,
            rating: b.rating ?? undefined
          });
          this.genresInput = b.genres.join(', ');
          this.reviewsInput = Array.isArray(b.reviews)
            ? b.reviews.map(r => `${r.name}: ${r.body}`).join('\n')
            : '';
        },
        error: err => {
          this.error.set(err.error?.error || 'Book not found.');
          this.notificationService.error(this.error()!);
        }
      });
    }
  }

  updateBook() {
    const bookData = this.book();
    if (!bookData || !bookData._id) return;
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    bookData.genres = this.genresInput.split(',').map(g => g.trim()).filter(Boolean);
    bookData.reviews = this.reviewsInput
      ? this.reviewsInput.split('\n').map(line => {
          const [name, ...body] = line.split(':');
          return { name: name.trim(), body: body.join(':').trim() };
        }).filter(r => r.name && r.body)
      : [];

    if (!bookData.reviews.length) {
      this.notificationService.error('At least one review is required.');
      this.isSubmitting = false;
      return;
    }

    this.bookService.updateBook(bookData._id, bookData).subscribe({
      next: () => {
        this.notificationService.success('Book updated successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/books']);
      },
      error: err => {
        const msg = err.status === 403 
          ? 'You are not authorized to update this book.' 
          : (err.error?.error || 'Failed to update book.');
        this.notificationService.error(msg);
        this.isSubmitting = false;
      }
    });
  }
}
