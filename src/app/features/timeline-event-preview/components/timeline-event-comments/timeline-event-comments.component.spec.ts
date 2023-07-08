import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventCommentsComponent } from './timeline-event-comments.component';

describe('TimelineEventCommentsComponent', () => {
  let component: TimelineEventCommentsComponent;
  let fixture: ComponentFixture<TimelineEventCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineEventCommentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineEventCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
