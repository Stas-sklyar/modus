import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { User } from '../../../../models/interfaces/user';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { TrialCase } from '../../../../models/interfaces';
import { UsersService } from '../../../../core/services/users/users.service';

@Component({
  selector: 'lr-participant-cases',
  templateUrl: './participant-cases.component.html',
  styleUrls: ['./participant-cases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantCasesComponent {

  relatedTrialCases: TrialCase[] = [];
  @Input() set user(user: User) {
    this.relatedTrialCases = this.usersService.getBelongsToUserCases(user);
  }
  appRoutes = AppRoutes;

  constructor(private usersService: UsersService) {
  }
}
