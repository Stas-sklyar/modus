import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFilterFormComponent } from './tasks-filter-form.component';

describe('TasksFilterFormComponent', () => {
  let component: TasksFilterFormComponent;
  let fixture: ComponentFixture<TasksFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksFilterFormComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(TasksFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
