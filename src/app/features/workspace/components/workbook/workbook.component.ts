import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CreateFolderModalComponent } from '../../../modals/components/create-folder-modal/create-folder-modal.component';
import { Modal } from '../../../../models/enums/modal';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { TrialCaseFolder } from '../../../../models/interfaces/trial-case-folder';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { mergeMap, Observable, Subscription } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-workbook',
  templateUrl: './workbook.component.html',
  styleUrls: ['./workbook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbookComponent implements OnInit, OnDestroy {
  selectedTrialCase$ = this.trialCasesService.selectedTrialCase$;
  folders$ = this.caseEntitiesService.folders$;
  private _subscription = new Subscription();
  constructor(
    private trialCasesService: TrialCasesService,
    private bsModalService: BsModalService,
    private caseEntitiesService: CaseEntitiesService,
    private notificationsSrv: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.loadFoldersByTrialCaseId();
  }

  openCreateFolderModal(
    caseId: string,
  ): void {
    this.bsModalService.show(CreateFolderModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateFolder,
      initialState: {
        caseId,
      },
      keyboard: true,
    });
  }

  openSortFoldersModal(folders: unknown[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: folders,
        trialCaseId,
        title: 'Sort Folders',
        fieldName: 'name',
        sortType: SortTypeEnum.SORT_FOLDERS,
      },
      keyboard: true,
    });
  }

  loadFoldersByTrialCaseId(): void {
    this._subscription.add(
      this.selectedTrialCase$
        .pipe(
          mergeMap((trialCase) => {
            if (trialCase) {
              return this.caseEntitiesService.loadFoldersByTrialCaseId(trialCase?.id || '');
            } else {
              return new Observable<TrialCaseFolder[]>(subscriber => subscriber.next([]));
            }
          }),
        )
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving folders list');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
