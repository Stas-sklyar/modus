import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDocumentsComponent } from './person-documents.component';

describe('PersonDocumentsComponent', () => {
  let component: PersonDocumentsComponent;
  let fixture: ComponentFixture<PersonDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonDocumentsComponent ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
