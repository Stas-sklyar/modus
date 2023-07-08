import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantCasesComponent } from './participant-cases.component';

describe('ParticipantCasesComponent', () => {
  let component: ParticipantCasesComponent;
  let fixture: ComponentFixture<ParticipantCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
