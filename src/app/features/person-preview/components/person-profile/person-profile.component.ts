import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TrialCasePerson } from '../../../../models/interfaces/trial-case-person';

@Component({
  selector: 'lr-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonProfileComponent {
  @Input() person!: TrialCasePerson;
}
