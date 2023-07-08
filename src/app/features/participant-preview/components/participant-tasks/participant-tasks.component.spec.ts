import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantTasksComponent } from './participant-tasks.component';

describe('ParticipantTasksComponent', () => {
  let component: ParticipantTasksComponent;
  let fixture: ComponentFixture<ParticipantTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
