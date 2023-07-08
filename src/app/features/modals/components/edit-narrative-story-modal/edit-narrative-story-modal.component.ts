import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NarrativeStoryEditForm } from '../../../../models/interfaces/edit-narrative-story-form';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCaseNarrativeStory } from '../../../../models/interfaces/trial-case-narrative-story';
import { finalize, Subscription, switchMap, take } from 'rxjs';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';

@Component({
  selector: 'lr-edit-narrative-story-modal',
  templateUrl: './edit-narrative-story-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNarrativeStoryModalComponent implements OnInit, OnDestroy {
  @Input() narrativeStory!: TrialCaseNarrativeStory;

  form = new FormGroup<NarrativeStoryEditForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  private _subscription = new Subscription();
  participants$ = this.trialCasePeopleService.people$;

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private trialCasesService: TrialCasesService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this.fillFormData();
    this.loadParticipants();
  }

  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  fillFormData(): void {
    this.form.get('title')?.setValue(this.narrativeStory.title);
    this.form.get('description')?.setValue(this.narrativeStory.description);
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  editNarrativeStory(): void {
    const { title, description } = this.form.value;
    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');

    this.form.disable();

    this._subscription.add(
      this.caseNarrativeEntitiesService.updateNarrativeStory(
        this.narrativeStory.id,
        title || '',
        description || '',
        mentionedPeopleList,
      )
        .pipe(
          switchMap(() => this.trialCasesService.loadFullDataByTrialCase(this.narrativeStory.trialCaseId)),
          take(1),
          finalize(() => this.form.enable()),
        )
        .pipe(
          switchMap(() => this.caseNarrativeEntitiesService.fetchNarrativeStoryContent(this.narrativeStory.id)),
          take(1),
        )
        .subscribe({
          next: () => {
            this.notificationsService.notifySuccess('Narrative story edited successfully');
            this.closeModal();
          },
          error: () => {
            this.notificationsService.notifyError('Something went wrong. Please, try again');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
