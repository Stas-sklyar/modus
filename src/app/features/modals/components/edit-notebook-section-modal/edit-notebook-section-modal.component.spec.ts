import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNotebookSectionModalComponent } from './edit-notebook-section-modal.component';

describe('CreateFolderFormComponent', () => {
  let component: EditNotebookSectionModalComponent;
  let fixture: ComponentFixture<EditNotebookSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNotebookSectionModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditNotebookSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
