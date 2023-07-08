import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditParticipantForm } from '../../../../models/interfaces/edit-participant-form';
import { User } from '../../../../models/interfaces/user';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize, forkJoin, Observable, Subject, switchMap, take } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { UsersService } from '../../../../core/services/users/users.service';
import { Company } from '../../../../models/interfaces/company';
import { RegistrationService } from '../../../../core/services/registration/registration.service';

@Component({
  selector: 'lr-edit-participant-modal',
  templateUrl: './edit-participant-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditParticipantModalComponent implements OnInit, OnDestroy {
  @Input() user!: User;

  form = new FormGroup<EditParticipantForm>({
    name: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    phone: new FormControl(null),
    address: new FormControl(null),
    companyName: new FormControl(null),
    description: new FormControl(null),
  });
  submitting = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private bsModalRef: BsModalRef,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
    private registrationService: RegistrationService,
  ) {}

  ngOnInit(): void {
    this.setInitialFormData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  editParticipant(): void {
    this.submitting = true;
    const { name } = this.form.value;

    this.saveChanges()
      .pipe(
        switchMap(() => forkJoin([
          this.usersService.getUsers(),
          this.usersService.getParticipant(this.user.id),
        ])),
        take(1),
        finalize(() => this.submitting = false),
      )
      .subscribe(() => {
        this.notificationsService.notifySuccess(`User ${ name } was edited`);
        this.closeModal();
      });
  }

  reInviteParticipant(): void {
    this.submitting = true;
    const {
      name,
      title,
      email,
    } = this.form.value;

    this.saveChanges()
      .pipe(
        switchMap(() => forkJoin([
          this.registrationService.invitePerson(email || '', title || '', null),
          this.usersService.getUsers(),
          this.usersService.getParticipant(this.user.id),
        ])),
        take(1),
        finalize(() => this.submitting = false),
      )
      .subscribe(() => {
        this.notificationsService.notifySuccess(`User ${ name } was edited and got invite on email ${ email }`);
        this.closeModal();
      });
  }

  saveChanges(): Observable<User> {
    const {
      name,
      title,
      email,
      phone,
      description,
      companyName,
      address,
    } = this.form.value;

    const userCompany = {
      name: companyName,
    } as Company;

    const user: Partial<User> = {
      name: name || '',
      title: title || '',
      email: email || '',
      phone: phone || null,
      description: description || null,
      // ...(companyName && {
      //   company: userCompany,
      // }),
    };

    return this.usersService.changeParticipantData(this.user.id, user);
  }

  setInitialFormData(): void {
    const { name, title, email, phone, description } = this.user;
    const address = null;
    const company = this.user.company?.name;

    this.form.controls.name.setValue(name || null);
    this.form.controls.title.setValue(title || null);
    this.form.controls.email.setValue(email || null);
    this.form.controls.phone.setValue(phone || null);
    this.form.controls.description.setValue(description || null);
    this.form.controls.address.setValue(address || null);
    this.form.controls.companyName.setValue(company || null);
  }
}
