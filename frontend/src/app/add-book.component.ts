import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Book } from './book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})

export class AddBookComponent {
  book: Book = { title: '', author: '', genres: [], pages: undefined as any, rating: undefined as any, reviews: [] };
  genresInput = '';
  reviewsInput = '';
  error = '';
  success = '';
  isSubmitting = false;

  constructor(private bookService: BookService, private router: Router) {}

  addBook() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    this.error = '';
    this.success = '';
    
    this.book.genres = this.genresInput.split(',').map(g => g.trim()).filter(Boolean);
    this.book.reviews = this.reviewsInput
      ? this.reviewsInput.split('\n').map(line => {
          const [name, ...body] = line.split(':');
          return { name: name.trim(), body: body.join(':').trim() };
        }).filter(r => r.name && r.body)
      : [];
    this.bookService.addBook(this.book).subscribe({
      next: () => {
        this.success = 'Book added!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: err => {
        this.error = err.error?.error || 'Failed to add book.';
        this.isSubmitting = false;
      }
    });
  }
}
