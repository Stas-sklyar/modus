import { Component } from '@angular/core';

@Component({
  selector: 'lr-recent-activities-cards',
  templateUrl: './recent-activities-cards.component.html',
  styleUrls: ['./recent-activities-cards.component.scss']
})
export class RecentActivitiesCardsComponent {

  // TODO: Fix component after implementation of the "recent-activities" entity on the BE
  public recentActivities: any[] = [];
}
