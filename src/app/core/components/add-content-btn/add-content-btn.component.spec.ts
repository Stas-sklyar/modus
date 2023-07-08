import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContentBtnComponent } from './add-content-btn.component';

describe('AddContentBtnComponent', () => {
  let component: AddContentBtnComponent;
  let fixture: ComponentFixture<AddContentBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContentBtnComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddContentBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
