import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeStoryCommentsComponent } from './case-narrative-story-comments.component';

describe('CaseNarrativeStoryCommentsComponent', () => {
  let component: CaseNarrativeStoryCommentsComponent;
  let fixture: ComponentFixture<CaseNarrativeStoryCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeStoryCommentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeStoryCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
