import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateDashboardComponent } from './private-dashboard.component';

describe('PrivateDashboardComponent', () => {
  let component: PrivateDashboardComponent;
  let fixture: ComponentFixture<PrivateDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrivateDashboardComponent]
    });
    fixture = TestBed.createComponent(PrivateDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
