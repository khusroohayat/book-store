import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from './book.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookServiceMock: any;
  let notificationServiceMock: any;

  beforeEach(async () => {
    bookServiceMock = {
      getBooks: jasmine.createSpy('getBooks').and.returnValue(of({ books: [], total: 0 })),
      deleteBook: jasmine.createSpy('deleteBook').and.returnValue(of(null))
    };
    notificationServiceMock = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success')
    };

    await TestBed.configureTestingModule({
      imports: [BookListComponent],
      providers: [
        { provide: BookService, useValue: bookServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when no books are returned and no error', () => {
    fixture.detectChanges(); // ngOnInit calls fetchBooks
    expect(component.books().length).toBe(0);
    expect(component.error()).toBeNull();
    expect(component.loading()).toBeFalse();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.empty-state')).toBeTruthy();
    expect(compiled.querySelector('.error-state')).toBeNull();
  });

  it('should show error state when fetch fails', () => {
    const errorResponse = { error: { error: 'Network error' } };
    bookServiceMock.getBooks.and.returnValue(throwError(() => errorResponse));
    
    component.fetchBooks();
    fixture.detectChanges();

    expect(component.books().length).toBe(0);
    expect(component.error()).toBe('Network error');
    expect(component.loading()).toBeFalse();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-state')).toBeTruthy();
    expect(compiled.querySelector('.empty-state')).toBeNull();
    expect(compiled.querySelector('.error-state p').textContent).toContain('Network error');
  });

  it('should clear error and show loading when retrying', () => {
    component.error.set('Previous error');
    const getBooksSubject = new Subject();
    bookServiceMock.getBooks.and.returnValue(getBooksSubject.asObservable());
    
    component.fetchBooks();
    
    // Intermediate state: error cleared, loading true
    expect(component.error()).toBeNull();
    expect(component.loading()).toBeTrue();

    // Complete the request
    getBooksSubject.next({ books: [], total: 0 });
    getBooksSubject.complete();

    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('should hide stats dashboard when no books are present', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stats-section')).toBeNull();
  });

  it('should show stats dashboard when books are present', () => {
    bookServiceMock.getBooks.and.returnValue(of({ 
      books: [{ 
        title: 'Book 1', 
        author: 'Author 1', 
        rating: 4, 
        genres: ['Fiction'], 
        pages: 200,
        reviews: [] 
      }], 
      total: 1 
    }));
    
    component.fetchBooks();
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.stats-section')).toBeTruthy();
  });
});
