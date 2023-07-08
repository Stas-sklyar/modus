import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEventPreviewComponent } from './components/timeline-event-preview/timeline-event-preview.component';
import {
  TimelineEventDocumentsComponent,
} from './components/timeline-event-documents/timeline-event-documents.component';
import { TimelineEventCommentsComponent } from './components/timeline-event-comments/timeline-event-comments.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { TimelineEventNotesComponent } from './components/timeline-event-notes/timeline-event-notes.component';
import { AddNoteComponent } from '../../core/components/add-note/add-note.component';
import { AsidePanelHeaderComponent } from '../../core/components/aside-panel-header/aside-panel-header.component';
import { UserCommentComponent } from '../../core/components/user-comment/user-comment.component';
import { AddCommentFormComponent } from '../../core/components/add-comment-form/add-comment-form.component';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { UploadFileControlComponent } from '../../core/components/upload-file-control/upload-file-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { SafeHtmlPipe } from '../../core/pipes/safe-html/safe-html.pipe';
import { CardPreviewModule } from '../card-preview/card-preview.module';
import { NotesComponent } from '../../core/components/notes/notes.component';
import { CommentsComponent } from '../../core/components/comments/comments.component';
import { RemoveDuplicatesDocumentsPipe } from '../../core/pipes/remove-dublicates/remove-duplicates-documents.pipe';


@NgModule({
  declarations: [
    TimelineEventPreviewComponent,
    TimelineEventDocumentsComponent,
    TimelineEventCommentsComponent,
    TimelineEventNotesComponent,
  ],
  imports: [
    CommonModule,
    AddContentBtnComponent,
    AddNoteComponent,
    AsidePanelHeaderComponent,
    UserCommentComponent,
    AddCommentFormComponent,
    DocumentCardComponent,
    UploadFileControlComponent,
    FormsModule,
    TextEditorComponent,
    ReactiveFormsModule,
    ApplyRedirectsToMentionsDirective,
    SafeHtmlPipe,
    CardPreviewModule,
    NotesComponent,
    CommentsComponent,
    RemoveDuplicatesDocumentsPipe,
  ],
  exports: [
    TimelineEventPreviewComponent,
  ],
})
export class TimelineEventPreviewModule { }
