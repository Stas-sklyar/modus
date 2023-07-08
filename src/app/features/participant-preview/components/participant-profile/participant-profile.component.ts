import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../models/interfaces/user';

@Component({
  selector: 'lr-participant-profile',
  templateUrl: './participant-profile.component.html',
  styleUrls: ['./participant-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantProfileComponent {
  @Input() user!: User;
}
