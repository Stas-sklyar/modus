import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../../core/services/users/users.service';
import { User } from '../../../../models/interfaces/user';
import { RegistrationService } from '../../../../core/services/registration/registration.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import {
  ConfirmationDialogModalComponent,
} from '../../../modals/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { Modal } from '../../../../models/enums/modal';
import {
  EditParticipantModalComponent,
} from '../../../modals/components/edit-participant-modal/edit-participant-modal.component';

type Category = 'profile' | 'cases' | 'tasks';

@Component({
  selector: 'lr-participant-preview',
  templateUrl: './participant-preview.component.html',
  styleUrls: ['./participant-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantPreviewComponent implements OnInit, OnDestroy {
  participantId: string | null = null;
  backTo: string | null = null;
  selectedUser$ = this.usersService.selectedUser$;
  selectedCategory$ = new BehaviorSubject<Category | null>('profile');
  private unsubscribe$ = new Subject<void>();

  constructor(
    private bsModalService: BsModalService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
    private notificationService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.listenToQueryParams();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.usersService.selectedUser = null;
  }

  closePanel(): void {
    window.history.back();
  }

  deleteUser(user: User): void {
    const hasRelationToCases = this.usersService.hasRelationToCases(user);

    this.bsModalService.show(ConfirmationDialogModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.DeleteParticipant,
      initialState: {
        ...(hasRelationToCases && {
          title: null,
          content: 'You cannot delete this user since it contains cases or tasks.',
          confirmButtonText: null,
          cancelButtonText: 'OK',
        }),
      },
      keyboard: true,
    }).content?.confirm
      .pipe(
        switchMap(() => this.usersService.removeParticipant(user.id)),
        switchMap(() => this.usersService.getUsers()),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.notificationService.notifySuccess(`User ${ user.name } has been removed`);
        this.closePanel();
      });
  }

  openEditUserModal(user: User): void {
    this.bsModalService.show(EditParticipantModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditParticipant,
      initialState: {
        user,
      },
      keyboard: true,
    });
  }

  sendInviteToUser(user: User): void {
    const { name, title, email } = user;
    if (!title || !email) return;
    this.registrationService.invitePerson(email, title, null)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.notificationService.notifySuccess(`User ${ name } have been invited via email`);
      });
  }

  private listenToQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        tap((params) => {
          this.participantId = params.get('participantId');
          this.backTo = params.get('backTo');
        }),
        switchMap((params) => {
          const participantId = params.get('participantId');
          return participantId ? this.usersService.getParticipant(participantId) : of(null);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe();
  }
}
