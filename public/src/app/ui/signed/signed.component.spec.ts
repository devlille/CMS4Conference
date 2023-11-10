import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignedComponent } from './signed.component';

describe('SignedComponent', () => {
  let component: SignedComponent;
  let fixture: ComponentFixture<SignedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SignedComponent]
    });
    fixture = TestBed.createComponent(SignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
