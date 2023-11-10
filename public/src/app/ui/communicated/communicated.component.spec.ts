import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicatedComponent } from './communicated.component';

describe('CommunicatedComponent', () => {
  let component: CommunicatedComponent;
  let fixture: ComponentFixture<CommunicatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommunicatedComponent]
    });
    fixture = TestBed.createComponent(CommunicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
