import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { CardCreateForm } from '../../../../models/interfaces';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';

@Component({
  selector: 'lr-create-card-modal',
  templateUrl: './create-card-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCardModalComponent implements OnInit, OnDestroy {
  @Input() parentId!: string;
  @Input() attachTo: 'workbook' | 'notebook' = 'workbook';

  cardForm = new FormGroup<CardCreateForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  participants$ = this.trialCasePeopleService.people$;
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private trialNotebookService: TrialNotebookService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initCardCreation(): void {
    const selectedSectionId = this.caseEntitiesService.selectedSection?.id;
    const { name, description } = this.cardForm.value;
    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');

    this.cardForm.disable();

    if (this.parentId && name) {
      this._subscription.add(
        this.caseEntitiesService.createCard(this.parentId, this.attachTo, name, description || '', mentionedPeopleList)
          .pipe(
            tap(() => {
              if (this.attachTo === 'workbook') {
                this.caseEntitiesService.expandedWorkbookSubsectionId = this.parentId;
              } else {
                this.trialNotebookService.expandedSectionId = this.parentId;
              }
            }),
            switchMap(() => {
              if (this.attachTo === 'workbook') {
                return this.caseEntitiesService.loadSubsectionsBySectionId(selectedSectionId || '');
              } else {
                return this.trialNotebookService.fetchSections();
              }
            }),
            tap(() => this.notificationsService.notifySuccess(`Card '${name}' was created`)),
            take(1),
            finalize(() => this.cardForm.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    }
  }

}
