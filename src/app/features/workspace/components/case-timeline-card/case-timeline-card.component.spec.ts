import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTimelineCardComponent } from './case-timeline-card.component';

describe('CaseTimelineCardComponent', () => {
  let component: CaseTimelineCardComponent;
  let fixture: ComponentFixture<CaseTimelineCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseTimelineCardComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseTimelineCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
