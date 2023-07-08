import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { UsersService } from '../../../../core/services/users/users.service';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html/safe-html.pipe';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { RouterModule } from '@angular/router';
import { TrialCasesComponent } from '../trial-cases/trial-cases.component';
import { CurrentUserRelatedTasksComponent } from '../current-user-related-tasks/current-user-related-tasks.component';

@Component({
  selector: 'lr-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SafeHtmlPipe, ApplyRedirectsToMentionsDirective, RouterModule, TrialCasesComponent, CurrentUserRelatedTasksComponent],
})
export class DashboardComponent {
  currentDate = new Date();
  appRoutes = AppRoutes;
  currentAppUser$ = this.usersService.currentUser$;
  get periodOfDay(): string {
    const hours = this.currentDate.getHours();
    return (hours >= 5 && hours < 12) ? 'morning' : 'afternoon';
  }

  constructor(
    private usersService: UsersService,
  ) { }

}
