import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileControlComponent } from './upload-file-control.component';

describe('UploadFileControlComponent', () => {
  let component: UploadFileControlComponent;
  let fixture: ComponentFixture<UploadFileControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileControlComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(UploadFileControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
