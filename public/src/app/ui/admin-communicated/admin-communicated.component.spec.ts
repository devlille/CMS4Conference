import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCommunicatedComponent } from './admin-communicated.component';

describe('AdminCommunicatedComponent', () => {
  let component: AdminCommunicatedComponent;
  let fixture: ComponentFixture<AdminCommunicatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminCommunicatedComponent]
    });
    fixture = TestBed.createComponent(AdminCommunicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
