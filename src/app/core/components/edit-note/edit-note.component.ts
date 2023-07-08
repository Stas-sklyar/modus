import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditNoteForm } from '../../../models/interfaces/edit-note-form';
import { TrialCasePeopleService } from '../../services/trial-case-people/trial-case-people.service';
import { EditingNote } from '../../../models/interfaces/editing-note';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { DocumentsBufferComponent } from '../documents-buffer/documents-buffer.component';
import { RelatedDocumentsComponent } from '../related-documents/related-documents.component';
import { Document } from '../../../models/interfaces/document';

@Component({
  selector: 'lr-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TextEditorComponent, DocumentsBufferComponent, RelatedDocumentsComponent],
})
export class EditNoteComponent implements OnInit, OnDestroy {
  @Output() hideFormEvent = new EventEmitter();
  @Output() editNoteEvent = new EventEmitter<EditingNote>();
  @Input() note!: any;
  participants$ = this.trialCasePeopleService.people$;
  private _subscription = new Subscription();

  form = new FormGroup<EditNoteForm>({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
  });

  constructor(
    private trialCasePeopleService: TrialCasePeopleService,
  ) {}

  ngOnInit(): void {
    this.setInitialFormState();
    this._subscription.add(
      this.trialCasePeopleService.getTrialCasePeople().subscribe(),
    );
  }

  closeForm(): void {
    this.hideFormEvent.emit();
  }

  updateNote(): void {
    const mentionedPeopleList = this.trialCasePeopleService.getMentionedPeopleList(this.form.value.description || '');

    this.editNoteEvent.emit({
      id: this.note.id,
      title: this.form.value.title || '',
      description: this.form.value.description || '',
      personMentions: mentionedPeopleList,
    });
  }

  private setInitialFormState(): void {
    this.form.get('title')?.setValue(this.note.title);
    this.form.get('description')?.setValue(this.note.description);
  }

  getRelatedNoteDocuments(note: any): Document[] | null {
    return note.documents?.map((item: any) => item.document) || null;
  }
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
