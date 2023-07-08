import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePersonModalComponent } from './create-person-modal.component';

describe('CreatePersonFormComponent', () => {
  let component: CreatePersonModalComponent;
  let fixture: ComponentFixture<CreatePersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePersonModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(CreatePersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
