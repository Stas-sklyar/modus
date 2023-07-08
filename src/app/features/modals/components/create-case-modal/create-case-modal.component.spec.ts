import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCaseModalComponent } from './create-case-modal.component';

describe('CreateCardFormComponent', () => {
  let component: CreateCaseModalComponent;
  let fixture: ComponentFixture<CreateCaseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCaseModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateCaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
