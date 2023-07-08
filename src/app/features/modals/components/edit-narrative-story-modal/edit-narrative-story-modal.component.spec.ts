import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNarrativeStoryModalComponent } from './edit-narrative-story-modal.component';

describe('EditNarrativeStoryComponent', () => {
  let component: EditNarrativeStoryModalComponent;
  let fixture: ComponentFixture<EditNarrativeStoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNarrativeStoryModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditNarrativeStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
