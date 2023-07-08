import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { Subscription, switchMap, take, tap } from 'rxjs';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { FormControl, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import { EditSectionModalComponent } from '../../../modals/components/edit-section-modal/edit-section-modal.component';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';

@Component({
  selector: 'lr-workbook-section',
  templateUrl: './workbook-section.component.html',
  styleUrls: ['./workbook-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbookSectionComponent implements OnDestroy {
  @ViewChild('scrollDestination') scrollDestination: ElementRef | null = null;
  @ViewChild('createPanelInput') createPanelInput: ElementRef | null = null;
  sectionId = this.route.snapshot.paramMap.get('sectionId');
  section$ = this.caseEntitiesService.selectedSection$;
  subSections$ = this.caseEntitiesService.subSections$;
  showControlPanel = false;
  newWorkbookSubsection = new FormControl('', Validators.required);
  private _subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private trialCasesService: TrialCasesService,
    private caseEntitiesService: CaseEntitiesService,
    private notificationsSrv: NotificationsService,
    private bsModalService: BsModalService,
  ) {
  }

  ngOnInit(): void {
    this.loadSectionContent();
    this.loadSubsections();
  }

  loadSectionContent(): void {
    if (this.sectionId) {
      this._subscription.add(
        this.caseEntitiesService.loadSectionContent(this.sectionId)
          .subscribe({
            error: () => {
              this.notificationsSrv.notifyError('An error occurred while receiving subsections list');
            },
          }),
      );
    }
  }

  loadSubsections(): void {
    if (this.sectionId) {
      this._subscription.add(
        this.caseEntitiesService.loadSubsectionsBySectionId(this.sectionId)
          .subscribe({
            error: () => {
              this.notificationsSrv.notifyError('An error occurred while receiving subsections list');
            },
          }),
      );
    }
  }

  initSubsectionCreation(workbookSectionId: string): void {
    const selectedSectionId = this.caseEntitiesService.selectedSection?.id;
    const workbookSubsectionName = this.newWorkbookSubsection.value;

    if (workbookSectionId && workbookSubsectionName) {
      this._subscription.add(
        this.caseEntitiesService.createWorkbookSubsection(workbookSectionId, workbookSubsectionName)
          .pipe(
            switchMap(() => this.caseEntitiesService.loadSubsectionsBySectionId(selectedSectionId || '')),
            tap(() => this.notificationsSrv.notifySuccess(`Workbook subsection '${workbookSubsectionName}' created`)),
            tap(() => {
              this.showControlPanel = false;
              this.newWorkbookSubsection.reset();
            }),
            take(1),
          )
          .subscribe(),
      );
    }
  }

  openEditSectionModal(sectionId: string): void {
    this.bsModalService.show(EditSectionModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditSection,
      initialState: {
        sectionId,
      },
      keyboard: true,
    });
  }

  showControlPanelHandler(): void {
    this.showControlPanel = !this.showControlPanel;

    if (this.showControlPanel && this.scrollDestination) {
      this.scrollDestination.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });

      setTimeout(() => {
        this.createPanelInput?.nativeElement.focus();
      }, 1000);
    }
  }

  onKeyUpAddSubsectionFormControl($event: KeyboardEvent, workbookSectionId: string): void {
    if ($event.code === 'Enter') {
      this.initSubsectionCreation(workbookSectionId);
    }
  }

  openSortSubsectionsModal(subsections: any[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: subsections,
        trialCaseId,
        title: 'Sort Subsections',
        fieldName: 'name',
        sortType: SortTypeEnum.SORT_SUBSECTIONS,
      },
      keyboard: true,
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
