import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeStoryItemComponent } from './narrative-story-item.component';

describe('AllegationPointCardComponent', () => {
  let component: NarrativeStoryItemComponent;
  let fixture: ComponentFixture<NarrativeStoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeStoryItemComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NarrativeStoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
