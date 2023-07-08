import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSectionModalComponent } from './edit-section-modal.component';

describe('CreateFolderFormComponent', () => {
  let component: EditSectionModalComponent;
  let fixture: ComponentFixture<EditSectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSectionModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
