import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNarrativeComponent } from './case-narrative.component';

describe('CaseNarrativeComponent', () => {
  let component: CaseNarrativeComponent;
  let fixture: ComponentFixture<CaseNarrativeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaseNarrativeComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CaseNarrativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
