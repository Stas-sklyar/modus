import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NarrativeStoryCreateForm } from '../../../../models/interfaces/narrative-story-form';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { finalize, Subscription, switchMap, take } from 'rxjs';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { TrialCasePeopleService } from '../../../../core/services/trial-case-people/trial-case-people.service';
import { NarrativeStoriesService } from '../../../../core/services/narrative-stories/narrative-stories.service';

@Component({
  selector: 'lr-create-narrative-story-modal',
  templateUrl: './create-narrative-story-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNarrativeStoryModalComponent implements OnInit, OnDestroy {
  form = new FormGroup<NarrativeStoryCreateForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  private _subscription = new Subscription();
  participants$ = this.trialCasePeopleService.people$;

  constructor(
    private notificationsService: NotificationsService,
    private bsModalRef: BsModalRef,
    private trialCasesService: TrialCasesService,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private trialCasePeopleService: TrialCasePeopleService,
    private narrativeStoriesService: NarrativeStoriesService,
  ) {}

  ngOnInit(): void {
    this.loadParticipants();
  }

  loadParticipants(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  createNarrativeStory(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;
    const { title, description } = this.form.value;
    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(description || '');

    this.form.disable();

    this._subscription.add(
      this.caseNarrativeEntitiesService.createNarrativeStory(
        trialCaseId || '',
        title || '',
        description || '',
        mentionedPeopleList,
      )
        .pipe(
          switchMap(() => this.narrativeStoriesService.loadNarrativeStoriesByTrialCaseId(trialCaseId || '')),
          take(1),
          finalize(() => this.form.enable()),
        )
        .subscribe({
          next: () => {
            this.closeModal();
            this.notificationsService.notifySuccess('New narrative story created successfully');
          },
        })
      ,
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
