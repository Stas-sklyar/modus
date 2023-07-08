import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentUserRelatedTasksComponent } from './current-user-related-tasks.component';

describe('UserRelatedTasksComponent', () => {
  let component: CurrentUserRelatedTasksComponent;
  let fixture: ComponentFixture<CurrentUserRelatedTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentUserRelatedTasksComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CurrentUserRelatedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
