import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFormModalComponent } from './tasks-form-modal.component';

describe('TasksFormModalComponent', () => {
  let component: TasksFormModalComponent;
  let fixture: ComponentFixture<TasksFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksFormModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TasksFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
