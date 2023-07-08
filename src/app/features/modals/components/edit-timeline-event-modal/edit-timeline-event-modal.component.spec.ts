import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimelineEventModalComponent } from './edit-timeline-event-modal.component';

describe('EditTimelineEventComponent', () => {
  let component: EditTimelineEventModalComponent;
  let fixture: ComponentFixture<EditTimelineEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTimelineEventModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditTimelineEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
