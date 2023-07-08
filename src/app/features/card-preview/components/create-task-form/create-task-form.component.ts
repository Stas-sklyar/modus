import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CardTaskCreateForm } from '../../../../models/interfaces/card-task-create-form';
import { NewTask } from '../../../../models/interfaces/new-task';
import { UsersService } from '../../../../core/services/users/users.service';
import { Subscription, take } from 'rxjs';

@Component({
  selector: 'lr-create-task-form',
  templateUrl: './create-task-form.component.html',
  styleUrls: ['./create-task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskFormComponent implements OnInit, OnDestroy  {
  @Output() cancelBtnWasPressed: EventEmitter<void> = new EventEmitter();
  @Output() submitBtnWasPressed: EventEmitter<NewTask> = new EventEmitter();

  createNewTaskForm = new FormGroup<CardTaskCreateForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    assignedToUserId: new FormControl(null, Validators.required),
    dueDate: new FormControl(null, Validators.required),
  });

  users$ = this.usersService.users$;
  private _subscription = new Subscription();

  constructor(
    private usersService: UsersService,
  ) {
  }

  ngOnInit(): void {
    this.loadAllUsers();
  }

  onClickSubmitButton(): void {
    const newTask: NewTask = {
      title: this.createNewTaskForm.value.title,
      description: this.createNewTaskForm.value.description,
      assignedToUserId:  this.createNewTaskForm.value.assignedToUserId,
      dueDate: this.createNewTaskForm.value.dueDate,
    };

    this.submitBtnWasPressed.emit(newTask);
  }

  onClickCancelButton(): void {
    this.cancelBtnWasPressed.emit();
  }

  private loadAllUsers(): void {
    this._subscription.add(
      this.usersService.getUsers()
        .pipe(take(1))
        .subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
