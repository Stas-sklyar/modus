import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotebookSectionEditForm } from '../../../../models/interfaces/notebook-section-edit-form';
import { TrialCaseNotebookSection } from '../../../../models/interfaces/trial-case-notebook-section';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';

@Component({
  selector: 'lr-edit-notebook-section-modal',
  templateUrl: './edit-notebook-section-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNotebookSectionModalComponent implements OnInit, OnDestroy {
  @Input() notebookSectionId!: string;

  form = new FormGroup<NotebookSectionEditForm>({
    title: new FormControl('', Validators.required),
  });
  notebookSection$:  Observable<TrialCaseNotebookSection> | null = null;
  private _subscription = new Subscription();

  constructor(
    private notificationsSrv: NotificationsService,
    private bsModalRef: BsModalRef,
    private trialNotebookService: TrialNotebookService,
  ) { }

  ngOnInit(): void {
    this.notebookSection$ = this.trialNotebookService.loadSectionContent(this.notebookSectionId)
      .pipe(
        tap(section => {
          this.form.get('title')?.setValue(section.title);
        }),
      );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initSectionEditing(): void {
    const { title } = this.form.value;

    if (this.notebookSectionId && title) {
      this.form.disable();

      this._subscription.add(
        this.trialNotebookService.updateSection(this.notebookSectionId, title)
          .pipe(
            switchMap(() => this.trialNotebookService.fetchSections()),
            tap(() => this.notificationsSrv.notifySuccess(`Trial notebook section '${title}' was edited`)),
            take(1),
            finalize(() => this.form.enable()),
          )
          .subscribe(() => {
            this.closeModal();
          }),
      );
    }
  }
}
