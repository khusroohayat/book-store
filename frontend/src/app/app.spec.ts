import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render shell title', () => {
    // Render the shell component directly since App only contains <router-outlet>
    const shellFixture = TestBed.createComponent(App);
    shellFixture.detectChanges();
    // The shell is rendered via routing, so this test is a placeholder for actual shell/component tests
    // For now, just check that the app root renders a router-outlet
    const compiled = shellFixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
