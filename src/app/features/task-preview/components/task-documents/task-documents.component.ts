import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { finalize, map, switchMap, take } from 'rxjs';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';

@Component({
  selector: 'lr-task-documents',
  templateUrl: './task-documents.component.html',
  styleUrls: ['./task-documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDocumentsComponent implements OnInit {
  @Input() task!: TrialCaseTask;
  hasUploadedDocuments$ = this.documentsService.uploadedDocumentsBuffer$
    .pipe(map((documents) => !!documents?.length));
  submitting = false;

  constructor(
    private documentsService: DocumentsService,
    private tasksService: TasksService,
    private notificationsService: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.documentsService.fetchDocs().pipe(take(1)).subscribe();
  }

  attachDocument(): void {
    const uploadedDocuments =
      this.documentsService.uploadedDocumentsBuffer?.map(document => ({ documentId: document.id }));
    if (!uploadedDocuments) return;

    this.submitting = true;
    this.tasksService.attachDocument(this.task.id, uploadedDocuments)
      .pipe(
        switchMap(() => this.tasksService.getTask(this.task.id)),
        take(1),
        finalize(() => this.submitting = false),
      )
      .subscribe(() => {
        this.documentsService.clearDocumentsBuffer();
        this.notificationsService.notifySuccess('New document(s) successfully added');
      });
  }
}
