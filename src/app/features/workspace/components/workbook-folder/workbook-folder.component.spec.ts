import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbookFolderComponent as FolderComponent } from './workbook-folder.component';

describe('WorkbookSectionComponent', () => {
  let component: FolderComponent;
  let fixture: ComponentFixture<FolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FolderComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(FolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
