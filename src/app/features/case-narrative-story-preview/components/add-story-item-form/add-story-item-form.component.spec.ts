import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryItemFormComponent } from './add-story-item-form.component';

describe('AddStoryItemFormComponent', () => {
  let component: AddStoryItemFormComponent;
  let fixture: ComponentFixture<AddStoryItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStoryItemFormComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddStoryItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
