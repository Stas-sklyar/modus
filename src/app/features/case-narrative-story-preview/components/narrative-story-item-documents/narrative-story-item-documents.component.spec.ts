import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeStoryItemDocumentsComponent } from './narrative-story-item-documents.component';

describe('NarrativeStoryItemDocumentsComponent', () => {
  let component: NarrativeStoryItemDocumentsComponent;
  let fixture: ComponentFixture<NarrativeStoryItemDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeStoryItemDocumentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NarrativeStoryItemDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
