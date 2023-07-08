import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortNarrativeStoryItemsModalComponent } from './sort-narrative-story-items-modal.component';

describe('SortNarativeStoryItemsModalComponent', () => {
  let component: SortNarrativeStoryItemsModalComponent;
  let fixture: ComponentFixture<SortNarrativeStoryItemsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortNarrativeStoryItemsModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SortNarrativeStoryItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
