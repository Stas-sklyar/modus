import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { finalize, switchMap, take } from 'rxjs';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'lr-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCommentsComponent {
  @Input() task!: TrialCaseTask;
  comment = new FormControl('');
  submitting = false;

  constructor(
    private tasksService: TasksService,
    private notificationsService: NotificationsService,
  ) {}

  createComment(comment: string | null): void {
    if (!comment) return;

    this.submitting = true;
    this.tasksService.createTaskComment(comment, this.task.id)
      .pipe(
        switchMap(() => this.tasksService.getTask(this.task.id)),
        take(1),
        finalize(() => this.submitting = false),
      )
      .subscribe(() => {
        this.comment.reset();
        this.notificationsService.notifySuccess('New comment successfully added');
      });
  }
}
