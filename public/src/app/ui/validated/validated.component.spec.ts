import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatedComponent } from './validated.component';

describe('ValidatedComponent', () => {
  let component: ValidatedComponent;
  let fixture: ComponentFixture<ValidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ValidatedComponent]
    });
    fixture = TestBed.createComponent(ValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
