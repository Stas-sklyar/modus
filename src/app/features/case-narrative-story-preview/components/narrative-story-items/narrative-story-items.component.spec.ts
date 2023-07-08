import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativeStoryItemsComponent } from './narrative-story-items.component';

describe('NarrativeStoryItemsComponent', () => {
  let component: NarrativeStoryItemsComponent;
  let fixture: ComponentFixture<NarrativeStoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativeStoryItemsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(NarrativeStoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
