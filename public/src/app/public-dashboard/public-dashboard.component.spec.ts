import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDashboardComponent } from './public-dashboard.component';

describe('PublicDashboardComponent', () => {
  let component: PublicDashboardComponent;
  let fixture: ComponentFixture<PublicDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PublicDashboardComponent]
    });
    fixture = TestBed.createComponent(PublicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
