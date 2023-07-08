import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialCasesComponent } from './trial-cases.component';

describe('TrialCasesComponent', () => {
  let component: TrialCasesComponent;
  let fixture: ComponentFixture<TrialCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialCasesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrialCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
