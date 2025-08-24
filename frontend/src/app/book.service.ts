import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  _id?: string;
  title: string;
  author: string;
  genres: string[];
  pages: number;
  rating: number;
  reviews: { name: string; body: string }[];
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private apiUrl = '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
