import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventPreviewComponent } from './timeline-event-preview.component';

describe('TimelineEventPreviewComponent', () => {
  let component: TimelineEventPreviewComponent;
  let fixture: ComponentFixture<TimelineEventPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineEventPreviewComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineEventPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
