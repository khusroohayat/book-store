

import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { AppShellComponent } from './app-shell.component';

export const routes: Routes = [
	// Landing page route (no shell)
	{ path: '', component: LandingComponent },
	// All other routes use the app shell
	{
		path: '',
		component: AppShellComponent,
		children: [
			{ path: 'books', loadComponent: () => import('./book-list.component').then(m => m.BookListComponent) },
			{ path: 'add', loadComponent: () => import('./add-book.component').then(m => m.AddBookComponent) },
			{ path: 'edit/:id', loadComponent: () => import('./edit-book.component').then(m => m.EditBookComponent) },
		]
	},
	{ path: '**', redirectTo: '' }
];
