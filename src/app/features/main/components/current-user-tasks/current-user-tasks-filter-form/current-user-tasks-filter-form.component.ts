import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  SearchAutocompleteComponent,
} from '../../../../../core/components/search-autocomplete/search-autocomplete.component';
import { SelectComponent } from '../../../../../core/components/select/select.component';
import { BtnModule } from '../../../../../shared/components/btn/btn.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TasksFormModalComponent } from '../../../../modals/components/tasks-form-modal/tasks-form-modal.component';
import { TasksService } from '../../../../../core/services/tasks/tasks.service';

@Component({
  selector: 'lr-current-user-tasks-filter-form',
  templateUrl: './current-user-tasks-filter-form.component.html',
  styleUrls: ['./current-user-tasks-filter-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SearchAutocompleteComponent,
    SelectComponent,
    BtnModule,
  ],
})
export class CurrentUserTasksFilterFormComponent implements OnDestroy {
  constructor(
    private bsModalService: BsModalService,
    private tasksService: TasksService,
  ) {
  }

  filterTasksBySearchQuery(query: string): void {
    this.tasksService.searchQuery = query || null;
  }

  filterTasksByDueDate(filterType: string[]): void {
    this.tasksService.dueDateFilter = (filterType.length === 0) ? null : filterType[0];
  }

  openCreateTaskModal(): void {
    this.bsModalService.show(TasksFormModalComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        modalType: 'create',
        caseInputIsVisible: true,
        openFrom: 'dashboard',
      },
      keyboard: true,
    });
  }

  ngOnDestroy(): void {
    this.tasksService.searchQuery = null;
    this.tasksService.dueDateFilter = null;
  }
}
