import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNotebookSectionModalComponent } from './create-notebook-section-modal.component';

describe('CreateSectionFormComponent', () => {
  let component: CreateNotebookSectionModalComponent;
  let fixture: ComponentFixture<CreateNotebookSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNotebookSectionModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateNotebookSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
