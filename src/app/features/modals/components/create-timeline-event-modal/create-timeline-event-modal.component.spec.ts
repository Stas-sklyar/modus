import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimelineEventModalComponent } from './create-timeline-event-modal.component';

describe('CreateTimelineEventComponent', () => {
  let component: CreateTimelineEventModalComponent;
  let fixture: ComponentFixture<CreateTimelineEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTimelineEventModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateTimelineEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
