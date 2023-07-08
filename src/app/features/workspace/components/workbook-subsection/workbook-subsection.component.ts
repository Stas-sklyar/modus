import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { TrialCaseSubsection } from '../../../../models/interfaces/trial-case-subsection';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import { CreateCardModalComponent } from '../../../modals/components/create-card-modal/create-card-modal.component';
import {
  EditSubsectionModalComponent,
} from '../../../modals/components/edit-subsection-modal/edit-subsection-modal.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';

@Component({
  selector: 'lr-workbook-subsection',
  templateUrl: './workbook-subsection.component.html',
  styleUrls: ['./workbook-subsection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbookSubsectionComponent {

  @Input() workbookSubsection!: TrialCaseSubsection;
  @Input() workbookSectionName = '';
  expandedSubsectionId$ = this.caseEntitiesService.expandedWorkbookSubsectionId$;

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private bsModalService: BsModalService,
    private offcanvasService: NgbOffcanvas,
    private router: Router,
    private trialCasesService: TrialCasesService,
  ) {
  }

  toggleExpand(id: string): void {
    this.caseEntitiesService.expandedWorkbookSubsectionId =
      this.caseEntitiesService.expandedWorkbookSubsectionId !== id ?
        id :
        null;
  }

  expandSelectedCard(
    cardId: string,
  ): void {
    this.router.navigate([], { queryParams: {
      cardId, backTo: this.workbookSectionName,
    } });
  }

  openCardCreationModal(parentId: string): void {
    this.bsModalService.show(CreateCardModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateCard,
      initialState: {
        parentId,
      },
      keyboard: true,
    });
  }

  openEditSubsectionModal(subsectionId: string): void {
    this.bsModalService.show(EditSubsectionModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditSubsection,
      initialState: {
        subsectionId,
      },
      keyboard: true,
    });
  }

  openSortCardsModal(): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: this.workbookSubsection.cards,
        trialCaseId,
        title: 'Sort Cards',
        fieldName: 'name',
        sortType: SortTypeEnum.SORT_CARDS,
      },
      keyboard: true,
    });
  }
}
