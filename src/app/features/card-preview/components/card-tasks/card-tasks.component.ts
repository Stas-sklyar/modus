import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges, OnDestroy, OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { TrialCaseTask } from '../../../../models/interfaces/trial-case-task';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CaseEntitiesService } from '../../../../core/services/case-entities/case-entities.service';
import { NewTask } from '../../../../models/interfaces/new-task';
import { TasksService } from '../../../../core/services/tasks/tasks.service';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
@Component({
  selector: 'lr-card-tasks',
  templateUrl: './card-tasks.component.html',
  styleUrls: ['./card-tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTasksComponent implements OnInit, OnChanges, OnDestroy {
  currentCardTasks$ = new BehaviorSubject<TrialCaseTask[] | null>(null);
  @Input() selectedAddContentMenuItemType: string | null = null;

  @Input() cardId: string = '';

  @ViewChild('createNewTaskSection') createNewTaskSection: ElementRef | null = null;
  addNewTaskSectionIsActive: boolean = false;

  private _subscription = new Subscription();

  constructor(
    private notificationsSrv: NotificationsService,
    private caseEntitiesService: CaseEntitiesService,
    private tasksService: TasksService,
    private trialCasesService: TrialCasesService,
  ) { }

  ngOnInit(): void {
    this.loadTasksByCardId();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedMenuItemType = changes['selectedAddContentMenuItemType']?.currentValue;
    if (selectedMenuItemType === 'tasks') {
      this.openAddTaskSection();
    }
  }

  loadTasksByCardId(): void {
    this._subscription.add(
      this.tasksService.loadTasksByCardId(this.cardId)
        .subscribe({
          next: tasks => {
            this.currentCardTasks$.next(tasks);
          },
          error: () => {
            this.notificationsSrv.notifyError('An error occurred while receiving tasks list');
          },
        }),
    );
  }
  addNewTask(task: NewTask): void {
    const selectedCaseId = this.trialCasesService.selectedTrialCase?.id;
    this.addNewTaskSectionIsActive = !this.addNewTaskSectionIsActive;

    if (task.title && task.assignedToUserId && this.cardId && selectedCaseId) {
      this._subscription.add(
        this.tasksService.createTask(
          task.title,
          selectedCaseId,
          this.currentCardTasks$.getValue()?.length || 0,
          task.description || '',
          task.dueDate || null,
          task.assignedToUserId || undefined,
          null,
          this.cardId,
        )
          .subscribe({
            next: () => {
              this.loadTasksByCardId();
              this.notificationsSrv.notifySuccess('New task added successfully');
            },
            error: () => {
              this.notificationsSrv.notifyError('An error occurred while updating tasks list');
            },
          }),
      );
    } else {
      this.notificationsSrv.notifyError('Enter required field');
    }
  }

  openAddTaskSection(): void {
    this.addNewTaskSectionIsActive = !this.addNewTaskSectionIsActive;

    if (this.addNewTaskSectionIsActive) {
      setTimeout(() => {
        this.createNewTaskSection?.nativeElement.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' } );
      }, 0);
    }
  }

  onClickCancelBtn(): void {
    this.addNewTaskSectionIsActive = !this.addNewTaskSectionIsActive;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
