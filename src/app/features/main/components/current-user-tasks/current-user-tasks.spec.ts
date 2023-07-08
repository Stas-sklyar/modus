import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserTasks } from './current-user-tasks';

describe('MyTasksComponent', () => {
  let component: CurrentUserTasks;
  let fixture: ComponentFixture<CurrentUserTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentUserTasks ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentUserTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
