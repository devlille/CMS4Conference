import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminValidatedComponent } from './admin-validated.component';

describe('AdminValidatedComponent', () => {
  let component: AdminValidatedComponent;
  let fixture: ComponentFixture<AdminValidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminValidatedComponent]
    });
    fixture = TestBed.createComponent(AdminValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
