import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditParticipantModalComponent } from './edit-participant-modal.component';

describe('EditParticipantModalComponent', () => {
  let component: EditParticipantModalComponent;
  let fixture: ComponentFixture<EditParticipantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditParticipantModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditParticipantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
