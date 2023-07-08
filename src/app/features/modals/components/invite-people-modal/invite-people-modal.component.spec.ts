import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitePeopleModalComponent } from './invite-people-modal.component';

describe('InvitePeopleModalComponent', () => {
  let component: InvitePeopleModalComponent;
  let fixture: ComponentFixture<InvitePeopleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitePeopleModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitePeopleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
