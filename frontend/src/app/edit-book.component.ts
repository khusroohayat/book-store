import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from './book.service';

@Component({
  selector: 'edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  book: Book | null = null;
  genresInput = '';
  reviewsInput = '';
  error = '';
  success = '';
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBook(id).subscribe({
        next: b => {
          // Ensure pages and rating are numbers or empty for form binding
          this.book = {
            ...b,
            pages: b.pages ?? undefined,
            rating: b.rating ?? undefined
          };
          this.genresInput = b.genres.join(', ');
          setTimeout(() => this.router.navigate(['/books']), 1000);
        },
        error: err => this.error = err.error?.error || 'Book not found.'
      });
    }
  }

  updateBook() {
    if (!this.book || !this.book._id) return;
    
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
    this.bookService.updateBook(this.book._id, this.book).subscribe({
      next: () => {
        this.success = 'Book updated!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: err => {
        this.error = err.error?.error || 'Failed to update book.';
        this.isSubmitting = false;
      }
    });
  }
}
