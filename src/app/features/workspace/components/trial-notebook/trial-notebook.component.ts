import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { Subscription } from 'rxjs';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';
import { Modal } from '../../../../models/enums/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  CreateNotebookSectionModalComponent,
} from '../../../modals/components/create-notebook-section-modal/create-notebook-section-modal.component';
import { Router } from '@angular/router';
import { CreateCardModalComponent } from '../../../modals/components/create-card-modal/create-card-modal.component';
import {
  EditNotebookSectionModalComponent,
} from '../../../modals/components/edit-notebook-section-modal/edit-notebook-section-modal.component';
import { TrialCaseCard } from '../../../../models/interfaces/trial-case-card';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { TrialCaseNotebookSection } from '../../../../models/interfaces/trial-case-notebook-section';

@Component({
  selector: 'lr-trial-notebook',
  templateUrl: './trial-notebook.component.html',
  styleUrls: ['./trial-notebook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrialNotebookComponent implements OnInit, OnDestroy {
  selectedCase$ = this.trialCasesService.selectedTrialCase$;
  trialNotebookSections$ = this.trialNotebookService.trialNotebookSections$;
  expandedSectionId$ = this.trialNotebookService.expandedSectionId$;
  private _subscription = new Subscription();

  constructor(
    private trialCasesService: TrialCasesService,
    private trialNotebookService: TrialNotebookService,
    private bsModalService: BsModalService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectedCase$.subscribe({
      next: (trialCase) => {
        if (trialCase?.id) {
          this.loadNotebookData();
        }
      },
    });
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  loadNotebookData(): void {
    this._subscription.add(
      this.trialNotebookService.fetchSections().subscribe(),
    );
  }

  toggleExpand(id: string): void {
    const expandedSectionId = this.trialNotebookService.expandedSectionId;
    this.trialNotebookService.expandedSectionId = (expandedSectionId === id) ? null : id;
  }

  expandSelectedCard(
    cardId: string,
  ): void {
    this.router.navigate([], { queryParams: {
      cardId, backTo: 'Trial Notebook',
    } });
  }

  openCreateSectionModal(trialCaseId: string): void {
    this.bsModalService.show(CreateNotebookSectionModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateNotebookSection,
      initialState: {
        trialCaseId,
      },
      keyboard: true,
    });
  }

  openCreateCardModal(trialNotebookSectionId: string): void {
    this.bsModalService.show(CreateCardModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.CreateCard,
      initialState: {
        parentId: trialNotebookSectionId,
        attachTo: 'notebook',
      },
      keyboard: true,
    });
  }

  openEditSectionModal(notebookSectionId: string): void {
    this.bsModalService.show(EditNotebookSectionModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditNotebookSection,
      initialState: {
        notebookSectionId,
      },
      keyboard: true,
    });
  }

  openSortCardsModal(cards: TrialCaseCard[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: cards,
        trialCaseId,
        title: 'Sort cards',
        fieldName: 'name',
        sortType: SortTypeEnum.SORT_NOTEBOOK_CARDS,
      },
      keyboard: true,
    });
  }

  openSortSectionsModal(notebookSections: TrialCaseNotebookSection[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: notebookSections,
        trialCaseId,
        title: 'Sort sections',
        fieldName: 'title',
        sortType: SortTypeEnum.SORT_NOTEBOOK_SECTIONS,
      },
      keyboard: true,
    });
  }
}
