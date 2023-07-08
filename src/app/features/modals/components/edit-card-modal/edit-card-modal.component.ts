import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { EditCardForm } from '../../../../models/interfaces/edit-card-form';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';

@Component({
  selector: 'lr-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCardModalComponent implements OnInit, OnDestroy  {
  @Input() cardId!: string;

  editCardForm = new FormGroup<EditCardForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  card$ = this.caseEntitiesService.selectedCard$
    .pipe(
      tap(card => {
        if (card) {
          this.editCardForm.get('name')?.setValue(card.name);
          this.editCardForm.get('description')?.setValue(card.description);
        }
      }),
    );
  participants$ = this.trialCasePeopleService.people$;
  private _subscription = new Subscription();

  constructor(
    private notificationsSrv: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private bsModalRef: BsModalRef,
    private trialCasePeopleService: TrialCasePeopleService,
    private trialNotebookService: TrialNotebookService,
  ) { }

  ngOnInit(): void {
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

  editCard(): void {
    const selectedSectionId = this.caseEntitiesService.selectedSection?.id;
    const { name, description } = this.editCardForm.value;

    if (this.cardId && name) {
      const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');

      this.editCardForm.disable();

      this._subscription.add(
        this.caseEntitiesService.updateWorkbookCard(this.cardId, name, description || '', mentionedPeopleList)
          .pipe(
            switchMap(() => this.caseEntitiesService.fetchCardContent(this.cardId || '')),
            switchMap(() => this.caseEntitiesService.loadSubsectionsBySectionId(selectedSectionId || '')),
            switchMap(() => this.trialNotebookService.fetchSections()),
            tap(() => this.notificationsSrv.notifySuccess(`Card '${name}' was edited`)),
            take(1),
            finalize(() => this.editCardForm.enable()),
          )
          .subscribe(
            {
              next: () => this.closeModal(),
              error: () => this.notificationsSrv.notifyError('An error occurred while receiving card data'),
            },
          ),
      );
    }
  }
}
