import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialNotebookComponent } from './trial-notebook.component';

describe('TrialNotebookComponent', () => {
  let component: TrialNotebookComponent;
  let fixture: ComponentFixture<TrialNotebookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialNotebookComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TrialNotebookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
