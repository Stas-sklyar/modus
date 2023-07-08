import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RecentActivitiesService } from '../../../../core/services/recent-activities/recent-activities.service';

@Component({
  selector: 'lr-recent-activities',
  templateUrl: './recent-activities.component.html',
  styleUrls: ['./recent-activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivitiesComponent {

  @Input() displayType: 'full' | 'reduced' = 'reduced';
  @Input() partialOutput = false;
  @Input() outputPortion = 3;

  recentActivities$ = this.recentActivitiesSrv.recentActivities$;

  constructor(
    private recentActivitiesSrv: RecentActivitiesService,
  ) {
  }

  increaseOutputPortion(): void {
    this.outputPortion = this.outputPortion + this.outputPortion;
  }
}
