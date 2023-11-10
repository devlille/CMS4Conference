import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignComponent } from './sign.component';

describe('SignComponent', () => {
  let component: SignComponent;
  let fixture: ComponentFixture<SignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SignComponent]
    });
    fixture = TestBed.createComponent(SignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
