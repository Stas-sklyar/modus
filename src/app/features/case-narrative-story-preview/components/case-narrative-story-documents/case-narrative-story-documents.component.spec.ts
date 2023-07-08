import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeStoryDocumentsComponent } from './case-narrative-story-documents.component';

describe('CaseNarrativeStoryDocumentsComponent', () => {
  let component: CaseNarrativeStoryDocumentsComponent;
  let fixture: ComponentFixture<CaseNarrativeStoryDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeStoryDocumentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeStoryDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
