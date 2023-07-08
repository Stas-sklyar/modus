import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPreviewComponent } from './components/document-preview/document-preview.component';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { DocumentInfoComponent } from './components/document-info/document-info.component';
import { ExhibitCardComponent } from './components/exhibit-card/exhibit-card.component';
import { DocumentCommentsComponent } from './components/document-comments/document-comments.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserCommentComponent } from '../../core/components/user-comment/user-comment.component';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TimeAgoPipe } from '../../core/pipes/time-ago/time-ago.pipe';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    DocumentPreviewComponent,
    DocumentInfoComponent,
    ExhibitCardComponent,
    DocumentCommentsComponent,
  ],
  imports: [
    CommonModule,
    BtnModule,
    BsDropdownModule,
    UserCommentComponent,
    TextEditorComponent,
    ReactiveFormsModule,
    TimeAgoPipe,
    RouterModule,
  ],
  exports: [
    DocumentPreviewComponent,
  ],
})
export class DocumentPreviewModule { }
