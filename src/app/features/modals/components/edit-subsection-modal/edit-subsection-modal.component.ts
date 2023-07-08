import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Observable, Subscription, switchMap, take, tap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { SubsectionEditForm } from '../../../../models/interfaces/subsection-edit-form';
import { TrialCaseSubsection } from '../../../../models/interfaces/trial-case-subsection';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-create-folder-modal',
  templateUrl: './edit-subsection-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSubsectionModalComponent implements OnInit, OnDestroy {
  @Input() subsectionId!: string;

  form = new FormGroup<SubsectionEditForm>({
    name: new FormControl('', Validators.required),
  });
  subsection$: Observable<TrialCaseSubsection> | null = null;
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsSrv: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {
    this.loadSubSectionContent();
  }

  loadSubSectionContent(): void {
    this.subsection$ = this.caseEntitiesService.loadSubsectionContent(this.subsectionId)
      .pipe(
        tap(section => {
          this.form.get('name')?.setValue(section.name);
        }),
      );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initSubsectionEditing(): void {
    const selectedSectionId = this.caseEntitiesService.selectedSection?.id;
    const { name } = this.form.value;

    if (this.subsectionId && name) {
      this.form.disable();

      this._subscription.add(
        this.caseEntitiesService.updateWorkbookSubsection(this.subsectionId, name)
          .pipe(
            switchMap(() => this.caseEntitiesService.loadSubsectionsBySectionId(selectedSectionId || '')),
            tap(() => this.notificationsSrv.notifySuccess(`Workbook subsection '${name}' was edited`)),
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
