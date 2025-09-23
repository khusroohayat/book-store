import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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

  constructor(private http: HttpClient, private auth: AuthService) {}
  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  getBooks(page = 1, limit = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() });
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book, { headers: this.getAuthHeaders() });
  }

  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book, { headers: this.getAuthHeaders() });
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
