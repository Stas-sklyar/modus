import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeStoryItemIssuesComponent } from './narrative-story-item-issues.component';

describe('NarrativeStoryItemIssuesComponent', () => {
  let component: NarrativeStoryItemIssuesComponent;
  let fixture: ComponentFixture<NarrativeStoryItemIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeStoryItemIssuesComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NarrativeStoryItemIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
