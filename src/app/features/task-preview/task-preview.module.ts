import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskPreviewComponent } from './components/task-preview/task-preview.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { TaskInfoComponent } from './components/task-info/task-info.component';
import { TaskCommentsComponent } from './components/task-comments/task-comments.component';
import { TaskDocumentsComponent } from './components/task-documents/task-documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { CommentsComponent } from '../../core/components/comments/comments.component';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { TimeAgoPipe } from '../../core/pipes/time-ago/time-ago.pipe';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { ClipListPipe } from '../../core/pipes/clip-list/clip-list.pipe';
import { DocumentsBufferComponent } from '../../core/components/documents-buffer/documents-buffer.component';



@NgModule({
  declarations: [
    TaskPreviewComponent,
    TaskInfoComponent,
    TaskCommentsComponent,
    TaskDocumentsComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    BtnModule,
    ReactiveFormsModule,
    DocumentCardComponent,
    AddContentBtnComponent,
    CommentsComponent,
    AutoFocusDirective,
    FormsModule,
    TimeAgoPipe,
    TextEditorComponent,
    ClipListPipe,
    DocumentsBufferComponent,
  ],
  exports: [
    TaskPreviewComponent,
  ],
})
export class TaskPreviewModule { }
