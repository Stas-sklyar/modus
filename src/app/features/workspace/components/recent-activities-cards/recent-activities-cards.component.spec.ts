import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivitiesCardsComponent } from './recent-activities-cards.component';

describe('RecentActivitiesCardsComponent', () => {
  let component: RecentActivitiesCardsComponent;
  let fixture: ComponentFixture<RecentActivitiesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentActivitiesCardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentActivitiesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
