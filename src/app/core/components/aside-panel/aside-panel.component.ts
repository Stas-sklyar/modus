import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, OnDestroy,
  OnInit, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { DocumentPreviewModule } from '../../../features/document-preview/document-preview.module';
import { CardPreviewModule } from '../../../features/card-preview/card-preview.module';
import { PersonPreviewModule } from '../../../features/person-preview/person-preview.module';
import { TimelineEventPreviewModule } from '../../../features/timeline-event-preview/timeline-event-preview.module';
import {
  CaseNarrativeStoryPreviewModule,
} from '../../../features/case-narrative-story-preview/case-narrative-story-preview.module';
import { Subscription } from 'rxjs';
import { ParticipantPreviewModule } from '../../../features/participant-preview/participant-preview.module';
import { TaskPreviewModule } from '../../../features/task-preview/task-preview.module';

@Component({
  selector: 'lr-aside-panel',
  standalone: true,
  imports: [
    CommonModule,
    OverlayModule,
    DocumentPreviewModule,
    CardPreviewModule,
    PersonPreviewModule,
    TimelineEventPreviewModule,
    CaseNarrativeStoryPreviewModule,
    ParticipantPreviewModule,
    TaskPreviewModule,
  ],
  templateUrl: './aside-panel.component.html',
  styleUrls: ['./aside-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsidePanelComponent implements OnInit, OnDestroy {
  @Output() scrollLock = new EventEmitter<boolean>();
  isOpen = false;
  selectedComponent: 'document' | 'card' | 'person' | 'timeline-event' | 'case-narrative' | 'participant' | 'task' | null = null;
  private _subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.listenToQueryParams();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  clearParams(): void {
    this.router.navigate([], {
      queryParams: null,
    });
  }

  private listenToQueryParams(): void {
    this._subscription.add(
      this.route.queryParamMap.subscribe(params => {
        const cardId = params.get('cardId');
        const eventId = params.get('eventId');
        const narrativeStoryId = params.get('narrativeStoryId');
        const personId = params.get('personId');
        const documentId = params.get('documentId');
        const participantId = params.get('participantId');
        const taskId = params.get('taskId');

        if (documentId) {
          this.selectedComponent = 'document';
        } else if (cardId) {
          this.selectedComponent = 'card';
        } else if (personId) {
          this.selectedComponent = 'person';
        } else if (eventId) {
          this.selectedComponent = 'timeline-event';
        } else if (narrativeStoryId) {
          this.selectedComponent = 'case-narrative';
        } else if (participantId) {
          this.selectedComponent = 'participant';
        } else if (taskId) {
          this.selectedComponent = 'task';
        } else {
          this.selectedComponent = null;
        }

        if (documentId || cardId || personId || eventId || narrativeStoryId || participantId || taskId) {
          this.isOpen = true;
          this.scrollLock.emit(true);
        } else {
          this.isOpen = false;
          this.scrollLock.emit(false);
        }

        this.cdr.detectChanges();
      }),
    );
  }
}
