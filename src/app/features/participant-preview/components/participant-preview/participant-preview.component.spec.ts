import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantPreviewComponent } from './participant-preview.component';

describe('ParticipantPreviewComponent', () => {
  let component: ParticipantPreviewComponent;
  let fixture: ComponentFixture<ParticipantPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantPreviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
