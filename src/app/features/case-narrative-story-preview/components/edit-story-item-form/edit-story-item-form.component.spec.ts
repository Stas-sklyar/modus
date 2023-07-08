import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoryItemFormComponent } from './edit-story-item-form.component';

describe('EditStoryItemFormComponent', () => {
  let component: EditStoryItemFormComponent;
  let fixture: ComponentFixture<EditStoryItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStoryItemFormComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditStoryItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
