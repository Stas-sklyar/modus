import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventNotesComponent } from './timeline-event-notes.component';

describe('TimelineEventNotesComponent', () => {
  let component: TimelineEventNotesComponent;
  let fixture: ComponentFixture<TimelineEventNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineEventNotesComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineEventNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
