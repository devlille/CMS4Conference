import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignedComponent } from './admin-signed.component';

describe('AdminSignedComponent', () => {
  let component: AdminSignedComponent;
  let fixture: ComponentFixture<AdminSignedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminSignedComponent]
    });
    fixture = TestBed.createComponent(AdminSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
