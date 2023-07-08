import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventDocumentsComponent } from './timeline-event-documents.component';

describe('TimelineEventDocumentsComponent', () => {
  let component: TimelineEventDocumentsComponent;
  let fixture: ComponentFixture<TimelineEventDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineEventDocumentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineEventDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
