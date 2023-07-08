import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserTasksFilterFormComponent } from './current-user-tasks-filter-form.component';

describe('MyTasksFilterFormComponent', () => {
  let component: CurrentUserTasksFilterFormComponent;
  let fixture: ComponentFixture<CurrentUserTasksFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentUserTasksFilterFormComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentUserTasksFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
