import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeStoryGeneralComponent } from './case-narrative-story-general.component';

describe('CaseNarrativeStoryGeneralComponent', () => {
  let component: CaseNarrativeStoryGeneralComponent;
  let fixture: ComponentFixture<CaseNarrativeStoryGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeStoryGeneralComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeStoryGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
