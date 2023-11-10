import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSocialComponent } from './admin-social.component';

describe('AdminSocialComponent', () => {
  let component: AdminSocialComponent;
  let fixture: ComponentFixture<AdminSocialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminSocialComponent]
    });
    fixture = TestBed.createComponent(AdminSocialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
