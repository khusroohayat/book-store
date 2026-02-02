

import { Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { AppShellComponent } from './app-shell.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	// Landing page route (no shell)
	{ path: '', component: LandingComponent },
	// All other routes use the app shell
	{
		path: '',
		component: AppShellComponent,
		children: [
			{ path: 'books', loadComponent: () => import('./book-list.component').then(m => m.BookListComponent), canActivate: [AuthGuard] },
			{ path: 'add', loadComponent: () => import('./add-book.component').then(m => m.AddBookComponent), canActivate: [AuthGuard] },
			{ path: 'edit/:id', loadComponent: () => import('./edit-book.component').then(m => m.EditBookComponent), canActivate: [AuthGuard] },
			{ path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
			{ path: 'register', loadComponent: () => import('./register.component').then(m => m.RegisterComponent) },
		]
	},
	{ path: '**', redirectTo: '' }
];
