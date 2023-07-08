import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookSubsectionComponent } from './workbook-subsection.component';

describe('SubsectionComponent', () => {
  let component: WorkbookSubsectionComponent;
  let fixture: ComponentFixture<WorkbookSubsectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkbookSubsectionComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(WorkbookSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
