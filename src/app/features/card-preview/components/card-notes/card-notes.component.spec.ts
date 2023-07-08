import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNotesComponent } from './card-notes.component';

describe('CardNotesComponent', () => {
  let component: CardNotesComponent;
  let fixture: ComponentFixture<CardNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
