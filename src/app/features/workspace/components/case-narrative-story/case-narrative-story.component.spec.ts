import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeStoryComponent } from './case-narrative-story.component';

describe('CaseNarrativeStoryComponent', () => {
  let component: CaseNarrativeStoryComponent;
  let fixture: ComponentFixture<CaseNarrativeStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeStoryComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
