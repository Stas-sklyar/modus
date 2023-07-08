import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseTimelineFiltersComponent } from './case-timeline-filters.component';

describe('CaseTimelineFiltersComponent', () => {
  let component: CaseTimelineFiltersComponent;
  let fixture: ComponentFixture<CaseTimelineFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseTimelineFiltersComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseTimelineFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
