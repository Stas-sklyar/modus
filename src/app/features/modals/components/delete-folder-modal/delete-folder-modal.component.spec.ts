import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFolderModalComponent } from './delete-folder-modal.component';

describe('AddFolderModalComponent', () => {
  let component: DeleteFolderModalComponent;
  let fixture: ComponentFixture<DeleteFolderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteFolderModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteFolderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
