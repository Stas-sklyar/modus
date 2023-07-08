import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { catchError, finalize, forkJoin, of, Subject } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RegistrationService } from '../../../../core/services/registration/registration.service';
import { ENTER } from '@angular/cdk/keycodes';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_CHIPS_DEFAULT_OPTIONS, MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'lr-invite-participant-modal',
  templateUrl: './invite-participant-modal.component.html',
  styleUrls: ['./invite-participant-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER],
      },
    },
  ],
})
export class InviteParticipantModalComponent implements OnDestroy {
  _emailList = new SelectionModel<string>(true);
  get emailList(): string[] {
    return this._emailList.selected;
  }
  submitting = false;
  unsubscribe$ = new Subject<void>();

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private cdr: ChangeDetectorRef,
    private registrationService: RegistrationService,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  submitForm(): void {
    if (this.emailList.length) {
      this.submitting = true;
      forkJoin(
        [...this.emailList
          .map(email => this.registrationService.invitePerson(email, null, null)
            .pipe(
              catchError((err) => of(err)),
            )),
        ],
      )
        .pipe(
          finalize(() => {
            this.submitting = false;
            this.cdr.detectChanges();
          }),
        )
        .subscribe(() => {
          this.notificationsService.notifySuccess('Users have been invited to a company via email');
          this.closeModal();
        });
    }
  }

  removeEmail(email: string): void {
    this._emailList.deselect(email);
  }

  addEmail(event: MatChipInputEvent): void {
    const { value, chipInput } = event;
    if (this.isValidEmail(value)) {
      this._emailList.select(value);
      chipInput!.clear();
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
