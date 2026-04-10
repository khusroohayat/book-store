import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from './book.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Component({
  selector: 'book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  books = signal<Book[]>([]);
  total = signal(0);
  page = signal(1);
  limit = signal(10);
  loading = signal(false);
  error = signal<string | null>(null);
  viewMode = signal<'grid' | 'list'>('grid');
  showDeleteModal = signal(false);
  bookToDelete = signal<Book | null>(null);
  Math = Math;

  totalPages = computed(() => Math.ceil(this.total() / this.limit()));
  averageRating = computed(() => {
    const b = this.books();
    if (b.length === 0) return 0;
    return b.reduce((acc, book) => acc + book.rating, 0) / b.length;
  });
  uniqueGenresCount = computed(() => {
    const allGenres = this.books().flatMap(book => book.genres);
    return new Set(allGenres).size;
  });
  totalBooksPages = computed(() => {
    return this.books().reduce((total, book) => total + (book.pages || 0), 0);
  });

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.loading.set(true);
    this.error.set(null);
    this.bookService.getBooks(this.page(), this.limit()).subscribe({
      next: (res: any) => {
        this.books.set(res.books);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: err => {
        const errorMsg = err.error?.error || 'Failed to load books.';
        this.error.set(errorMsg);
        this.notificationService.error(errorMsg);
        this.loading.set(false);
      }
    });
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      this.fetchBooks();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.fetchBooks();
    }
  }

  editBook(book: Book) {
    this.router.navigate(['/edit', book._id]);
  }

  deleteBook(book: Book) {
    this.bookToDelete.set(book);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.bookToDelete.set(null);
  }

  confirmDelete() {
    const book = this.bookToDelete();
    if (!book || !book._id) return;

    this.bookService.deleteBook(book._id).subscribe({
      next: () => {
        this.fetchBooks();
        this.notificationService.success(`"${book.title}" deleted successfully!`);
        this.closeDeleteModal();
      },
      error: err => {
        const msg = err.status === 403 
          ? 'You are not authorized to delete this book.' 
          : (err.error?.error || 'Failed to delete book.');
        this.notificationService.error(msg);
        this.closeDeleteModal();
      }
    });
  }

  trackByBookId(index: number, book: Book): string {
    return book._id || index.toString();
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    const emptyStars = 5 - Math.ceil(rating);
    stars += '☆'.repeat(emptyStars);
    return stars;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }
}