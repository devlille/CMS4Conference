import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaidComponent } from './admin-paid.component';

describe('AdminPaidComponent', () => {
  let component: AdminPaidComponent;
  let fixture: ComponentFixture<AdminPaidComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminPaidComponent]
    });
    fixture = TestBed.createComponent(AdminPaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
