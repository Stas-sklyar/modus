import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryItemBtnComponent } from './add-story-item-btn.component';

describe('AddStoryItemBtnComponent', () => {
  let component: AddStoryItemBtnComponent;
  let fixture: ComponentFixture<AddStoryItemBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStoryItemBtnComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddStoryItemBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
