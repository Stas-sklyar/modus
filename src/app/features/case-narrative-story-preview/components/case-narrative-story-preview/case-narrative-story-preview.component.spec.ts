import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeStoryPreviewComponent } from './case-narrative-story-preview.component';

describe('CaseNarrativeStoryPreviewComponent', () => {
  let component: CaseNarrativeStoryPreviewComponent;
  let fixture: ComponentFixture<CaseNarrativeStoryPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeStoryPreviewComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeStoryPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
