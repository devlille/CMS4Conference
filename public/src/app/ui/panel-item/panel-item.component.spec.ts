import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelItemComponent } from './panel-item.component';

describe('PanelItemComponent', () => {
  let component: PanelItemComponent;
  let fixture: ComponentFixture<PanelItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PanelItemComponent]
    });
    fixture = TestBed.createComponent(PanelItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
