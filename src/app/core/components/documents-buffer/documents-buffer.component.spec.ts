import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsBufferComponent } from './documents-buffer.component';

describe('DocumentsBufferComponent', () => {
  let component: DocumentsBufferComponent;
  let fixture: ComponentFixture<DocumentsBufferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DocumentsBufferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
