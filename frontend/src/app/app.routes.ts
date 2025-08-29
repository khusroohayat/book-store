
import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { BookListComponent } from './book-list.component';
import { AddBookComponent } from './add-book.component';
import { EditBookComponent } from './edit-book.component';

export const routes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'books', component: BookListComponent },
	{ path: 'add', loadComponent: () => import('./add-book.component').then(m => m.AddBookComponent) },
	{ path: 'edit/:id', loadComponent: () => import('./edit-book.component').then(m => m.EditBookComponent) },
	{ path: '**', redirectTo: '' }
];
