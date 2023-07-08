import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateCaseModalComponent } from '../modals/components/create-case-modal/create-case-modal.component';
import { Modal } from '../../models/enums/modal';
import { LoginService } from '../../core/services/login/login.service';
import { AppRoutes } from '../../models/enums/app-routes';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  InviteParticipantModalComponent,
} from '../modals/components/invite-participant-modal/invite-participant-modal.component';

@Component({
  selector: 'lr-app-top-menu',
  templateUrl: './app-top-menu.component.html',
  styleUrls: ['./app-top-menu.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, BsDropdownModule],
})
export class AppTopMenuComponent {
  appRoutes = AppRoutes;

  constructor(
    private bsModalService: BsModalService,
    private loginService: LoginService,
  ) {
  }

  openCreateCaseModal(): void {
    this.bsModalService.show(CreateCaseModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateCase,
      keyboard: true,
    });
  }

  openInvitePeopleModal(): void {
    this.bsModalService.show(InviteParticipantModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.InvitePeople,
      keyboard: true,
    });
  }

  logout(): void {
    this.loginService.logout();
  }
}
