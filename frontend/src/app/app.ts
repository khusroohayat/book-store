
import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BookListComponent } from './book-list.component';
import { AddBookComponent } from './add-book.component';
import { EditBookComponent } from './edit-book.component';
import { BookService } from './book.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HttpClientModule, BookListComponent, AddBookComponent, EditBookComponent],
  providers: [BookService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
