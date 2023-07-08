import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFolderModalComponent } from './edit-folder-modal.component';

describe('CreateFolderFormComponent', () => {
  let component: EditFolderModalComponent;
  let fixture: ComponentFixture<EditFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFolderModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
