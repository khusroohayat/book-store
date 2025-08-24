import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Book } from './book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'book-list',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit() {
    this.fetchBooks();
  }

  fetchBooks() {
    this.loading = true;
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
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book._id!).subscribe({
        next: () => this.fetchBooks(),
        error: err => alert(err.error?.error || 'Delete failed.')
      });
    }
  }
}
