import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDocumentsComponent } from './task-documents.component';

describe('TaskDocumentsComponent', () => {
  let component: TaskDocumentsComponent;
  let fixture: ComponentFixture<TaskDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
