import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookService, Book } from './book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  total = 0;
  page = 1;
  limit = 10;
  loading = false;
  error = '';
  viewMode: 'grid' | 'list' = 'grid';
  Math = Math;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.loading = true;
    this.error = '';
    this.bookService.getBooks(this.page, this.limit).subscribe({
      next: (res: any) => {
        this.books = res.books;
        this.total = res.total;
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.error || 'Failed to load books.';
        this.loading = false;
      }
    });
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.fetchBooks();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchBooks();
    }
  }

  editBook(book: Book) {
    this.router.navigate(['/edit', book._id]);
  }

  deleteBook(book: Book) {
    if (confirm(`Are you sure you want to delete "${book.title}"?\n\nThis action cannot be undone.`)) {
      this.bookService.deleteBook(book._id!).subscribe({
        next: () => {
          this.fetchBooks();
          // Show success message briefly
          const originalError = this.error;
          this.error = '';
          setTimeout(() => {
            if (!originalError) {
              // Only show success if there wasn't already an error
              this.showTemporaryMessage('Book deleted successfully!', 'success');
            }
          }, 100);
        },
        error: err => {
          this.error = err.error?.error || 'Failed to delete book.';
        }
      });
    }
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

  getAverageRating(): number {
    if (this.books.length === 0) return 0;
    const sum = this.books.reduce((acc, book) => acc + book.rating, 0);
    return sum / this.books.length;
  }

  getTotalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  getUniqueGenres(): number {
    const allGenres = this.books.flatMap(book => book.genres);
    return new Set(allGenres).size;
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  private showTemporaryMessage(message: string, type: 'success' | 'error') {
    // This is a simple implementation - in a real app you might use a toast service
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'success' ? 'success' : 'error'}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.minWidth = '300px';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }
}