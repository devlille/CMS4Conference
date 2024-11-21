import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';

import { AppComponent } from './app.component';

const MockAuth = {
  onAuthStateChanged: () => {}
};

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: Auth,
          useValue: MockAuth
        }
      ]
    })
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
