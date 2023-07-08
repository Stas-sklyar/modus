import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CaseNarrativeStoryPreviewComponent,
} from './components/case-narrative-story-preview/case-narrative-story-preview.component';
import {
  CaseNarrativeStoryCommentsComponent,
} from './components/case-narrative-story-comments/case-narrative-story-comments.component';
import {
  CaseNarrativeStoryDocumentsComponent,
} from './components/case-narrative-story-documents/case-narrative-story-documents.component';
import {
  CaseNarrativeStoryGeneralComponent,
} from './components/case-narrative-story-general/case-narrative-story-general.component';
import { AsidePanelHeaderComponent } from '../../core/components/aside-panel-header/aside-panel-header.component';
import { AddNoteComponent } from '../../core/components/add-note/add-note.component';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { UploadFileControlComponent } from '../../core/components/upload-file-control/upload-file-control.component';
import { UserCommentComponent } from '../../core/components/user-comment/user-comment.component';
import { AddCommentFormComponent } from '../../core/components/add-comment-form/add-comment-form.component';
import { CommentsComponent } from '../../core/components/comments/comments.component';
import { NarrativeStoryItemsComponent } from './components/narrative-story-items/narrative-story-items.component';
import { SortByOrderPipe } from '../../shared/pipes/sort-by-order/sort-by-order.pipe';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { ConfirmationModalComponent } from '../../core/components/confirmation-modal/confirmation-modal.component';
import { SafeHtmlPipe } from '../../core/pipes/safe-html/safe-html.pipe';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { AddStoryItemFormComponent } from './components/add-story-item-form/add-story-item-form.component';
import { EditStoryItemFormComponent } from './components/edit-story-item-form/edit-story-item-form.component';
import { AddStoryItemBtnComponent } from './components/add-story-item-btn/add-story-item-btn.component';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { NarrativeStoryItemIssuesComponent } from './components/narrative-story-item-issues/narrative-story-item-issues.component';
import { NarrativeStoryItemDocumentsComponent } from './components/narrative-story-item-documents/narrative-story-item-documents.component';
import { RelatedDocumentsComponent } from '../../core/components/related-documents/related-documents.component';
import { DocumentsBufferComponent } from '../../core/components/documents-buffer/documents-buffer.component';
import { RemoveDuplicatesDocumentsPipe } from '../../core/pipes/remove-dublicates/remove-duplicates-documents.pipe';



@NgModule({
  declarations: [
    CaseNarrativeStoryPreviewComponent,
    CaseNarrativeStoryCommentsComponent,
    CaseNarrativeStoryDocumentsComponent,
    CaseNarrativeStoryGeneralComponent,
    NarrativeStoryItemsComponent,
    AddStoryItemFormComponent,
    EditStoryItemFormComponent,
    AddStoryItemBtnComponent,
    NarrativeStoryItemIssuesComponent,
    NarrativeStoryItemDocumentsComponent,
  ],
  imports: [
    CommonModule,
    AsidePanelHeaderComponent,
    AddNoteComponent,
    DocumentCardComponent,
    AddContentBtnComponent,
    UploadFileControlComponent,
    UserCommentComponent,
    AddCommentFormComponent,
    CommentsComponent,
    SortByOrderPipe,
    BtnModule,
    ConfirmationModalComponent,
    SafeHtmlPipe,
    ApplyRedirectsToMentionsDirective,
    AutoFocusDirective,
    ReactiveFormsModule,
    TextEditorComponent,
    RelatedDocumentsComponent,
    DocumentsBufferComponent,
    RemoveDuplicatesDocumentsPipe,
  ],
  exports: [
    CaseNarrativeStoryPreviewComponent,
  ],
})
export class CaseNarrativeStoryPreviewModule { }
