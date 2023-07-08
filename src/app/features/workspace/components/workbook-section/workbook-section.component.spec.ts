import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookSectionComponent as SectionComponent } from './workbook-section.component';

describe('WorkbookSectionComponent', () => {
  let component: SectionComponent;
  let fixture: ComponentFixture<SectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
