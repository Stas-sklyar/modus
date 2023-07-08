import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonPreviewComponent } from './components/person-preview/person-preview.component';
import { PersonDocumentsComponent } from './components/person-documents/person-documents.component';
import { PersonProfileComponent } from './components/person-profile/person-profile.component';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { UploadFileControlComponent } from '../../core/components/upload-file-control/upload-file-control.component';
import { GetInitialsPipe } from '../../core/pipes/get-initials/get-initials.pipe';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { SafeHtmlPipe } from '../../core/pipes/safe-html/safe-html.pipe';



@NgModule({
  declarations: [
    PersonPreviewComponent,
    PersonDocumentsComponent,
    PersonProfileComponent,
  ],
  imports: [
    CommonModule,
    BtnModule,
    DocumentCardComponent,
    AddContentBtnComponent,
    UploadFileControlComponent,
    GetInitialsPipe,
    TextEditorComponent,
    SafeHtmlPipe,
  ],
  exports: [
    PersonPreviewComponent,
  ],
})
export class PersonPreviewModule { }
