import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, Renderer2, TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TrialCaseCard } from '../../../../models/interfaces/trial-case-card';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Modal } from '../../../../models/enums/modal';
import { EditCardModalComponent } from '../../../modals/components/edit-card-modal/edit-card-modal.component';
import { TrialCaseCardNote } from '../../../../models/interfaces/trial-case-card-note';
import { SortCaseEntitiesModalComponent } from '../../../modals/components/sort-case-entities-modal/sort-case-entities-modal.component';
import { SortTypeEnum } from '../../../../models/enums/sort-type';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { TrialNotebookService } from '../../../../core/services/trial-notebook/trial-notebook.service';

@Component({
  selector: 'lr-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPreviewComponent implements OnInit, OnDestroy, AfterContentChecked {
  @ViewChild('headerContainer') headerContainer: ElementRef | null = null;
  @ViewChild('cardPreview') cardPreview: ElementRef | null = null;

  cardId = this.route.snapshot.queryParamMap.get('cardId');
  backTo = this.route.snapshot.queryParamMap.get('backTo');
  card$ = this.caseEntitiesService.selectedCard$;
  notes$ = this.caseEntitiesService.notes$;
  cardCategories: string[] = ['general', 'comments', 'documents', 'tasks'];
  selectedCategory = 'general';
  errorOccurred: boolean = false;
  cardHeaderMenuIsActive: boolean = false;
  selectedAddContentMenuItemType: string | null = null;
  private _subscription = new Subscription();
  confirmationModalRef?: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private caseEntitiesService: CaseEntitiesService,
    private notificationsSrv: NotificationsService,
    private bsModalService: BsModalService,
    private _renderer: Renderer2,
    private trialCasesService: TrialCasesService,
    private trialNotebookService: TrialNotebookService,
    private offcanvasService: NgbOffcanvas,
  ) {
  }

  ngOnInit(): void {
    this.loadCardData();
  }

  ngAfterContentChecked(): void {
    this.calcHeaderContainerHeight();
  }

  ngOnDestroy(): void {
    this.caseEntitiesService.eraseCurrentCard();
    this._subscription.unsubscribe();
  }

  loadCardData(): void {
    if (this.cardId) {
      this._subscription.add(
        this.caseEntitiesService.fetchCardContent(this.cardId)
          .subscribe({
            error: () => {
              this.notificationsSrv.notifyError('An error occurred while receiving card data');
            },
          }),
      );
    }
  }

  calcHeaderContainerHeight(): void {
    if (this.headerContainer?.nativeElement.offsetHeight) {
      const unnecessaryPadding = 20;
      const headerContainerHeight = this.headerContainer?.nativeElement.offsetHeight - unnecessaryPadding;

      this._renderer.setStyle(this.cardPreview?.nativeElement, 'paddingTop', headerContainerHeight + 'px');
    }
  }

  closePanel(): void {
    this.router.navigate([], {
      queryParams: null,
    });
  }

  openEditCardModal(cardId: string): void {
    this.bsModalService.show(EditCardModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditCard,
      initialState: {
        cardId,
      },
      keyboard: true,
    });
  }

  openAddContentMenu(menuItemType: string): void {
    this.cardHeaderMenuIsActive = !this.cardHeaderMenuIsActive;
    this.selectedCategory = menuItemType;
    this.selectedAddContentMenuItemType = menuItemType;
    this.caseEntitiesService.openedAddContentMenuItemType = menuItemType;
  }

  showConfirmationModalForDeletingCards(confirmationModalTemplate: TemplateRef<any>): void {
    this.confirmationModalRef = this.bsModalService.show(confirmationModalTemplate);
  }

  deletionConfirmationCanceled(): void {
    this.confirmationModalRef?.hide();
  }

  deletionConfirmationConfirmed(card: TrialCaseCard): void {
    this.confirmationModalRef?.hide();
    this.deleteCard(card);
  }

  deleteCard(card: TrialCaseCard): void {

    if (this.cardId) {
      this._subscription.add(
        this.caseEntitiesService.deleteWorkbookCard(this.cardId)
          .subscribe(
            {
              next: () => {
                const cardIsRelatedToNotebookSection: boolean = !!card.trialNotebookSectionId;

                if (cardIsRelatedToNotebookSection) {
                  this.updateNotebookSectionsData();
                } else {
                  this.updateCardsList();
                }

                this.notificationsSrv.notifySuccess('Сard has been successfully deleted');
                this.offcanvasService.dismiss('Сard has been successfully deleted');
                this.closePanel();
              },
              error: () => this.notificationsSrv.notifyError('An error occurred while deleting card'),
            },
          ),
      );
    }
  }

  updateNotebookSectionsData(): void {
    this.trialNotebookService.fetchSections()
      .subscribe({
        error: () => this.notificationsSrv.notifyError('An error occurred while receiving data about notebook sections. Please reload the page.'),
      });
  }

  updateCardsList(): void {
    const sectionId = this.caseEntitiesService.selectedSection?.id;

    this.caseEntitiesService.loadSubsectionsBySectionId(sectionId || '')
      .subscribe({
        error: () => this.notificationsSrv.notifyError('An error occurred while updating card list. Please reload the page.'),
      });
  }

  hideHeaderMenu(): void {
    if (this.cardHeaderMenuIsActive) {
      this.cardHeaderMenuIsActive = false;
    }
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory = category;
  }

  openSortNotesModal(notes: TrialCaseCardNote[]): void {
    const trialCaseId = this.trialCasesService.selectedTrialCase?.id;

    this.bsModalService.show(SortCaseEntitiesModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortCaseEntities,
      initialState: {
        entities: notes,
        trialCaseId,
        title: 'Sort Notes',
        fieldName: 'title',
        sortType: SortTypeEnum.SORT_CARD_NOTES,
      },
      keyboard: true,
    });
  }
}
