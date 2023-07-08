import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFolderModalComponent } from './document-folder-modal.component';

describe('AddFolderModalComponent', () => {
  let component: DocumentFolderModalComponent;
  let fixture: ComponentFixture<DocumentFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentFolderModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
