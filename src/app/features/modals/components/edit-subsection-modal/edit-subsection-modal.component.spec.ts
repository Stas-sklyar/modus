import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubsectionModalComponent } from './edit-subsection-modal.component';

describe('CreateFolderFormComponent', () => {
  let component: EditSubsectionModalComponent;
  let fixture: ComponentFixture<EditSubsectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSubsectionModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditSubsectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
