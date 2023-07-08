import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InvitePersonForm } from '../../../../models/interfaces/invite-person-form';
import { RegistrationService } from '../../../../core/services/registration/registration.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';


@Component({
  selector: 'lr-invite-people-modal',
  templateUrl: './invite-people-modal.component.html',
  styleUrls: ['./invite-people-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitePeopleModalComponent implements OnDestroy {
  submitting = false;
  form = new FormGroup({
    invitations: new FormArray([this.createInvitation()], Validators.required),
  });
  private _subscription = new Subscription();

  get invitations(): FormArray {
    return this.form.controls.invitations;
  }

  constructor(
    private bsModalRef: BsModalRef,
    private registrationService: RegistrationService,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationsService,
  ) {}

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  addInvitation(): void {
    this.invitations.push(this.createInvitation());
  }

  createInvitation(): FormGroup<InvitePersonForm> {
    return new FormGroup<InvitePersonForm>({
      title: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      role: new FormControl(null, Validators.required),
    });
  }

  removeInvitation(index: number): void {
    this.form.controls.invitations.removeAt(index);
    this.cdr.detectChanges();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  submitForm(): void {
    const invitedPeople = this.form.controls.invitations.value;
    if (invitedPeople.length) {
      this.submitting = true;
      this._subscription.add(
        forkJoin([
          ...invitedPeople.map(({ title, email, role }) => this.registrationService.invitePerson(
            email || '',
            title || '',
            role || null,
          )),
        ])
          .pipe(
            finalize(() => {
              this.submitting = false;
              this.cdr.detectChanges();
            }),
          )
          .subscribe(() => {
            this.notificationService.notifySuccess('Mentioned users have been invited to a company via email');
            this.closeModal();
          }),
      );
    }
  }
}
