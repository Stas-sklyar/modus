import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy, OnInit,
} from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { Subscription } from 'rxjs';
import { TrialCaseCardNote } from '../../../../models/interfaces/trial-case-card-note';
import { TrialCaseCardNoteDocument } from '../../../../models/interfaces/trial-case-card-note-document';

@Component({
  selector: 'lr-card-documents',
  templateUrl: './card-documents.component.html',
  styleUrls: ['./card-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDocumentsComponent implements OnInit, OnDestroy {
  @Input() selectedAddContentMenuItemType?: string | null = null;
  @Input() cardId = '';
  notes$ = this.caseEntitiesService.notes$;
  private _subscription = new Subscription();
  constructor(
    private notificationsSrv: NotificationsService,
    private caseEntitiesService: CaseEntitiesService,
  ) { }

  ngOnInit(): void {
    this.loadNotesByCardId();
  }

  loadNotesByCardId(): void {
    this._subscription.add(
      this.caseEntitiesService.loadNotesByCardId(this.cardId)
        .subscribe({
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving documents list');
          },
        }),
    );
  }

  getRelatedDocuments(notes: TrialCaseCardNote[]): TrialCaseCardNoteDocument[] {
    let documents: TrialCaseCardNoteDocument[] = [];

    for (let i = 0; i < notes.length; i++) {
      documents = documents.concat(notes[i].documents);
    }

    return documents;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
