import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateNoteForm } from '../../../models/interfaces/create-note-form';
import { NewNote } from '../../../models/interfaces/new-note';
import { Subscription } from 'rxjs';
import { CaseEntitiesService } from '../../services/case-entities/case-entities.service';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { TrialCasePeopleService } from '../../services/trial-case-people/trial-case-people.service';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus/auto-focus.directive';
import { DocumentsBufferComponent } from '../documents-buffer/documents-buffer.component';

@Component({
  selector: 'lr-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TextEditorComponent, AutoFocusDirective, DocumentsBufferComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AddNoteComponent implements OnInit, OnDestroy {
  @Output() changeVisibilityFormEvent = new EventEmitter<'cancel' | 'confirm'>();
  @Output() clickAddNoteBtn = new EventEmitter<NewNote>();
  @Input() cancelBtnIsActive!: boolean;
  @Input() order!: number;
  private _subscription = new Subscription();

  form = new FormGroup<CreateNoteForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });
  participants$ = this.trialCasePeopleService.people$;

  constructor(
    private caseEntitiesService: CaseEntitiesService,
    private notificationsService: NotificationsService,
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  closeForm(typeOfPressedBtn: 'cancel' | 'confirm'): void {
    this.changeVisibilityFormEvent.emit(typeOfPressedBtn);
  }

  onClickAddNoteBtn(): void {
    this.clickAddNoteBtn.emit({
      title: this.form.value.title,
      description: this.form.value.description,
      order: this.order,
    });

    this.form.reset();
    this.closeForm('confirm');
  }
}
