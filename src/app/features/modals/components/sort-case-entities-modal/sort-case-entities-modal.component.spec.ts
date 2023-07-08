import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortCaseEntitiesModalComponent } from './sort-case-entities-modal.component';

describe('SortCaseEntitiesComponent', () => {
  let component: SortCaseEntitiesModalComponent;
  let fixture: ComponentFixture<SortCaseEntitiesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SortCaseEntitiesModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SortCaseEntitiesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
