import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCaseFolder } from '../../../../models/interfaces/trial-case-folder';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import {
  CreateSectionModalComponent,
} from '../../../modals/components/create-section-modal/create-section-modal.component';
import { EditFolderModalComponent } from '../../../modals/components/edit-folder-modal/edit-folder-modal.component';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';

@Component({
  selector: 'lr-workbook-folder',
  templateUrl: './workbook-folder.component.html',
  styleUrls: ['./workbook-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbookFolderComponent {

  @Input() workbookFolder!: TrialCaseFolder;
  expandedFolderId$ = this.caseEntitiesService.expandedWorkbookFolderId$;

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private bsModalService: BsModalService,
    private trialCasesService: TrialCasesService,
  ) {}

  toggleExpand(id: string): void {
    this.caseEntitiesService.expandedWorkbookFolderId =
      this.caseEntitiesService.expandedWorkbookFolderId !== id ?
        id :
        null;
  }

  openCreateSectionModal(folderId: string): void {
    this.bsModalService.show(CreateSectionModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateSection,
      initialState: {
        folderId,
      },
      keyboard: true,
    });
  }

  openEditFolderModal(folderId: string): void {
    this.bsModalService.show(EditFolderModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditFolder,
      initialState: {
        folderId,
      },
      keyboard: true,
    });
  }

  openSortSectionsModal(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: this.workbookFolder.sections,
        trialCaseId,
        title: 'Sort Sections',
        fieldName: 'name',
        sortType: SortTypeEnum.SORT_SECTIONS,
      },
      keyboard: true,
    });
  }
}
