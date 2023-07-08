import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNarrativeStoryModalComponent } from './create-narrative-story-modal.component';

describe('CreateNarrativeStoryComponent', () => {
  let component: CreateNarrativeStoryModalComponent;
  let fixture: ComponentFixture<CreateNarrativeStoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNarrativeStoryModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateNarrativeStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
