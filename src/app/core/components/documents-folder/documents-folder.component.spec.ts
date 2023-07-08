import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsFolderComponent } from './documents-folder.component';

describe('DocumentsFolderComponent', () => {
  let component: DocumentsFolderComponent;
  let fixture: ComponentFixture<DocumentsFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DocumentsFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
