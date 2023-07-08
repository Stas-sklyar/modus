import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFormModalComponent } from './document-form-modal.component';

describe('AddDocumentModalComponent', () => {
  let component: DocumentFormModalComponent;
  let fixture: ComponentFixture<DocumentFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentFormModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
