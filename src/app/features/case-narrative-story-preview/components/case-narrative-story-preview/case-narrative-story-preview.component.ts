import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit, Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription, switchMap, take } from 'rxjs';
import { Modal } from '../../../../models/enums/modal';
import {
  EditNarrativeStoryModalComponent,
} from '../../../modals/components/edit-narrative-story-modal/edit-narrative-story-modal.component';
import {
  SortNarrativeStoryItemsModalComponent,
} from '../../../modals/components/sort-narative-story-items-modal/sort-narrative-story-items-modal.component';
import {
  CaseNarrativeEntitiesService,
} from '../../../../core/services/case-narrative-entities.ts/case-narrative-entities.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TrialCaseNarrativeStory } from '../../../../models/interfaces/trial-case-narrative-story';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';

@Component({
  selector: 'lr-case-narrative-story-preview',
  templateUrl: './case-narrative-story-preview.component.html',
  styleUrls: ['./case-narrative-story-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseNarrativeStoryPreviewComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild('headerContainer') headerContainer: ElementRef | null = null;
  @ViewChild('narrativeStoryPreview') narrativeStoryPreview: ElementRef | null = null;
  selectedNarrativeStory$ = this.caseNarrativeEntitiesService.selectedNarrativeStory$;
  narrativeStoryId = this.route.snapshot.queryParamMap.get('narrativeStoryId');
  categoryList: string[] = ['story', 'comments', 'documents'];
  selectedCategory: string = 'story';
  private _subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bsModalService: BsModalService,
    private caseNarrativeEntitiesService: CaseNarrativeEntitiesService,
    private notificationsSrv: NotificationsService,
    private _renderer: Renderer2,
    private trialCasesService: TrialCasesService,
  ) { }

  ngOnInit(): void {
    this.fetchNarrativeStoryData();
  }

  ngAfterContentChecked(): void {
    this.calcHeaderContainerHeight();
  }

  fetchNarrativeStoryData(): void {
    if (this.narrativeStoryId) {
      this._subscription.add(
        this.caseNarrativeEntitiesService.fetchNarrativeStoryContent(this.narrativeStoryId)
          .subscribe({
            error: () => {
              this.notificationsSrv.notifyError('An error occurred on the server while receiving narrative story data');
            },
          }),
      );
    }
  }

  calcHeaderContainerHeight(): void {
    if (this.headerContainer?.nativeElement.offsetHeight) {
      const unnecessaryPadding = 20;
      const headerContainerHeight = this.headerContainer?.nativeElement.offsetHeight - unnecessaryPadding;

      this._renderer.setStyle(this.narrativeStoryPreview?.nativeElement, 'paddingTop', headerContainerHeight + 'px');
    }
  }

  openEditNarrativeStoryModal(narrativeStory: TrialCaseNarrativeStory): void {
    this.bsModalService.show(EditNarrativeStoryModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditNarrativeStory,
      initialState: {
        narrativeStory,
      },
      keyboard: true,
    });
  }

  onCreateContent(menuItemType: string): void {
    if (menuItemType === 'allegation' || menuItemType === 'fact' || menuItemType === 'note') {
      this.selectedCategory = 'story';
      this.caseNarrativeEntitiesService.typeOfOpenAddStoryItemForm = menuItemType;
    } else {
      this.selectedCategory = menuItemType;
    }

  }

  openSortStoryItemsModal(): void {
    const storyItems = this.caseNarrativeEntitiesService.storyItems || [];

    this.bsModalService.show(SortNarrativeStoryItemsModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.SortStoryItems,
      initialState: {
        storyItems,
      },
      keyboard: true,
    });
  }

  deleteNarrativeStory(): void {
    const caseId = this.trialCasesService.selectedTrialCase?.id;

    this._subscription.add(
      this.caseNarrativeEntitiesService.deleteNarrativeStory(this.narrativeStoryId || '')
        .pipe(
          switchMap(() => this.trialCasesService.loadFullDataByTrialCase(caseId || '')),
          take(1),
        )
        .subscribe({
          next: () => {
            this.cleanUrlParams();
            this.notificationsSrv.notifySuccess('Narrative story removed successfully');
          },
          error: () => {
            this.notificationsSrv.notifyError('Something went wrong! Please try again');
          },
        }),
    );
  }

  ngOnDestroy(): void {
    this.caseNarrativeEntitiesService.eraseCurrentSelectedNarrativeStory();
    this._subscription.unsubscribe();
  }

  private cleanUrlParams(): void {
    this.router.navigate([], {
      queryParams: null,
    });
  }
}
