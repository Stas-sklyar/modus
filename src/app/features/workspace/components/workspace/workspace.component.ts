import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, take } from 'rxjs';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { AppRoutes } from '../../../../models/enums/app-routes';
import { RecentActivitiesService } from '../../../../core/services/recent-activities/recent-activities.service';
import { MainRoutes } from '../../../../models/enums/main-routes';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CardPreviewComponent } from '../../../card-preview/components/card-preview/card-preview.component';
import {
  TimelineEventPreviewComponent,
} from '../../../timeline-event-preview/components/timeline-event-preview/timeline-event-preview.component';
import {
  CaseNarrativeStoryPreviewComponent,
} from '../../../case-narrative-story-preview/components/case-narrative-story-preview/case-narrative-story-preview.component';
import { PersonPreviewComponent } from '../../../person-preview/components/person-preview/person-preview.component';
import {
  DocumentPreviewComponent,
} from '../../../document-preview/components/document-preview/document-preview.component';

@Component({
  selector: 'lr-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  private _subscription = new Subscription();
  private _scrollLock = false;
  get scrollLock(): boolean {
    return this._scrollLock;
  }
  set scrollLock(value: boolean) {
    this._scrollLock = value;
  }

  constructor(
    public trialCasesService: TrialCasesService,
    private recentActivitiesService: RecentActivitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private offcanvasService: NgbOffcanvas,
  ) { }

  ngOnInit(): void {
    const caseId = this.route.snapshot.paramMap.get('caseId');

    if (caseId) {
      this._subscription.add(
        this.trialCasesService.loadFullDataByTrialCase(caseId)
          .pipe(
            // switchMap(() => this.recentActivitiesService.loadActivities()),
            take(1),
          )
          .subscribe(),
      );
    } else {
      this.router.navigate([AppRoutes.MAIN, MainRoutes.DASHBOARD]);
    }

    this._subscription.add(
      this.route.queryParamMap.subscribe(params => {
        const cardId = params.get('cardId');
        const eventId = params.get('eventId');
        const narrativeStoryId = params.get('narrativeStoryId');
        const personId = params.get('personId');
        const documentId = params.get('documentId');
        // if (cardId) {
        //   this.offcanvasService.open(CardPreviewComponent, { position: 'end' });
        // }
        //
        // if (eventId) {
        //   this.offcanvasService.open(TimelineEventPreviewComponent, { position: 'end' });
        // }
        //
        // if (narrativeStoryId) {
        //   this.offcanvasService.open(CaseNarrativeStoryPreviewComponent, { position: 'end' });
        // }
        //
        // if (personId) {
        //   this.offcanvasService.open(PersonPreviewComponent, { position: 'end' });
        // }
        //
        // if (documentId) {
        //   this.offcanvasService.open(DocumentPreviewComponent, { position: 'end' });
        // }
      }),
    );

  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
