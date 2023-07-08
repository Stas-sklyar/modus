import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitFormModalComponent } from './exhibit-form-modal.component';

describe('AddExhibitModalComponent', () => {
  let component: ExhibitFormModalComponent;
  let fixture: ComponentFixture<ExhibitFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExhibitFormModalComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ExhibitFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
