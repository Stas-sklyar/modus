import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription, switchMap, take, tap } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { SectionEditForm } from '../../../../models/interfaces/section-edit-form';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-edit-section-modal-modal',
  templateUrl: './edit-section-modal.component.html',
  styleUrls: ['./edit-section-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSectionModalComponent implements OnDestroy {
  @Input() sectionId!: string;

  form = new FormGroup<SectionEditForm>({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  section$ = this.caseEntitiesService.selectedSection$
    .pipe(
      tap(section => {
        if (section) {
          this.form.get('name')?.setValue(section.name);
          this.form.get('description')?.setValue(section.description);
        }
      }),
    );
  private _subscription = new Subscription();

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private trialCasesService: TrialCasesService,
    private notificationsSrv: NotificationsService,
    private bsModalRef: BsModalRef,
  ) { }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  initSectionEditing(): void {
    const { name, description } = this.form.value;

    if (this.sectionId && name) {
      this.form.disable();

      this._subscription.add(
        this.caseEntitiesService.updateWorkbookSection(this.sectionId, name, description || '')
          .pipe(
            switchMap(() => this.caseEntitiesService.loadSectionContent(this.sectionId || '')),
            tap(() => this.notificationsSrv.notifySuccess(`Workbook section '${name}' was edited`)),
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
