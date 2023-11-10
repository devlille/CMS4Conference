import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFilledComponent } from './admin-filled.component';

describe('AdminFilledComponent', () => {
  let component: AdminFilledComponent;
  let fixture: ComponentFixture<AdminFilledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminFilledComponent]
    });
    fixture = TestBed.createComponent(AdminFilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
