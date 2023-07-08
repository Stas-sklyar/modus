import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardPreviewComponent } from './components/card-preview/card-preview.component';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { CardNotesComponent } from './components/card-notes/card-notes.component';
import { CardDocumentsComponent } from './components/card-documents/card-documents.component';
import { CardCommentsComponent } from './components/card-comments/card-comments.component';
import { CardTasksComponent } from './components/card-tasks/card-tasks.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UploadFileControlComponent } from '../../core/components/upload-file-control/upload-file-control.component';
import { CreateTaskFormComponent } from './components/create-task-form/create-task-form.component';
import { AddNoteComponent } from '../../core/components/add-note/add-note.component';
import { AddCommentFormComponent } from '../../core/components/add-comment-form/add-comment-form.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { ConfirmationModalComponent } from '../../core/components/confirmation-modal/confirmation-modal.component';
import { SafeHtmlPipe } from '../../core/pipes/safe-html/safe-html.pipe';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { NotesComponent } from '../../core/components/notes/notes.component';
import { CommentsComponent } from '../../core/components/comments/comments.component';
import { RelatedDocumentsComponent } from '../../core/components/related-documents/related-documents.component';
import { SortByOrderPipe } from '../../shared/pipes/sort-by-order/sort-by-order.pipe';
import { RemoveDuplicatesDocumentsPipe } from '../../core/pipes/remove-dublicates/remove-duplicates-documents.pipe';
import { TimeAgoPipe } from '../../core/pipes/time-ago/time-ago.pipe';


@NgModule({
  declarations: [
    CardPreviewComponent,
    CardNotesComponent,
    CardDocumentsComponent,
    CardCommentsComponent,
    CardTasksComponent,
    CreateTaskFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BtnModule,
    AddContentBtnComponent,
    UploadFileControlComponent,
    AddNoteComponent,
    AddCommentFormComponent,
    BsDropdownModule,
    DocumentCardComponent,
    ConfirmationModalComponent,
    SafeHtmlPipe,
    ApplyRedirectsToMentionsDirective,
    TextEditorComponent,
    AutoFocusDirective,
    NotesComponent,
    NotesComponent,
    CommentsComponent,
    RelatedDocumentsComponent,
    SortByOrderPipe,
    RemoveDuplicatesDocumentsPipe,
    TimeAgoPipe,
  ],
  exports: [
    CardPreviewComponent,
  ],
})
export class CardPreviewModule { }
