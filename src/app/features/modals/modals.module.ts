import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { CreateFolderModalComponent } from './components/create-folder-modal/create-folder-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateSectionModalComponent } from './components/create-section-modal/create-section-modal.component';
import { CreateCardModalComponent } from './components/create-card-modal/create-card-modal.component';
import { GetObjKeysPipe } from '../../shared/pipes/get-obj-keys/get-obj-keys.pipe';
import { CreateCaseModalComponent } from './components/create-case-modal/create-case-modal.component';
import { EditFolderModalComponent } from './components/edit-folder-modal/edit-folder-modal.component';
import { EditSectionModalComponent } from './components/edit-section-modal/edit-section-modal.component';
import { EditSubsectionModalComponent } from './components/edit-subsection-modal/edit-subsection-modal.component';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { CreateTimelineEventModalComponent } from './components/create-timeline-event-modal/create-timeline-event-modal.component';
import { EditTimelineEventModalComponent } from './components/edit-timeline-event-modal/edit-timeline-event-modal.component';
import { DocumentCardComponent } from '../../core/components/document-card/document-card.component';
import { UserCommentComponent } from '../../core/components/user-comment/user-comment.component';
import { EditNarrativeStoryModalComponent } from './components/edit-narrative-story-modal/edit-narrative-story-modal.component';
import { CreateNarrativeStoryModalComponent } from './components/create-narrative-story-modal/create-narrative-story-modal.component';
import { AddCommentFormComponent } from '../../core/components/add-comment-form/add-comment-form.component';
import { TagComponent } from '../../core/components/tag/tag.component';
import { EditCardModalComponent } from './components/edit-card-modal/edit-card-modal.component';
import { CreatePersonModalComponent } from './components/create-person-modal/create-person-modal.component';
import { EditPersonModalComponent } from './components/edit-person-modal/edit-person-modal.component';
import { AddNoteComponent } from '../../core/components/add-note/add-note.component';
import { AsidePanelHeaderComponent } from '../../core/components/aside-panel-header/aside-panel-header.component';
import { AddContentBtnComponent } from '../../core/components/add-content-btn/add-content-btn.component';
import { UploadFileControlComponent } from '../../core/components/upload-file-control/upload-file-control.component';
import {
  CreateNotebookSectionModalComponent,
} from './components/create-notebook-section-modal/create-notebook-section-modal.component';
import {
  EditNotebookSectionModalComponent,
} from './components/edit-notebook-section-modal/edit-notebook-section-modal.component';
import { TextEditorComponent } from '../../core/components/text-editor/text-editor.component';
import { SortCaseEntitiesModalComponent } from './components/sort-case-entities-modal/sort-case-entities-modal.component';
import { EditCaseModalComponent } from './components/edit-case-modal/edit-case-modal.component';
import { DocumentFormModalComponent } from './components/document-form-modal/document-form-modal.component';
import { ExhibitFormModalComponent } from './components/exhibit-form-modal/exhibit-form-modal.component';
import { DocumentFolderModalComponent } from './components/document-folder-modal/document-folder-modal.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CdkDropList } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { DeleteFolderModalComponent } from './components/delete-folder-modal/delete-folder-modal.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { DeleteDocumentModalComponent } from './components/delete-document-modal/delete-document-modal.component';
import { InvitePeopleModalComponent } from './components/invite-people-modal/invite-people-modal.component';
import { SortByOrderPipe } from '../../shared/pipes/sort-by-order/sort-by-order.pipe';
import { ConfirmationDialogModalComponent } from './components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import { EditParticipantModalComponent } from './components/edit-participant-modal/edit-participant-modal.component';
import { InviteParticipantModalComponent } from './components/invite-participant-modal/invite-participant-modal.component';
import { ModalComponent } from './components/modal/modal.component';
import { TasksFormModalComponent } from './components/tasks-form-modal/tasks-form-modal.component';
import { SelectComponent } from '../../core/components/select/select.component';

@NgModule({
  declarations: [
    CreateFolderModalComponent,
    CreateSectionModalComponent,
    CreateCardModalComponent,
    CreateCaseModalComponent,
    EditFolderModalComponent,
    EditSectionModalComponent,
    EditSubsectionModalComponent,
    EditTimelineEventModalComponent,
    EditNarrativeStoryModalComponent,
    CreateNarrativeStoryModalComponent,
    CreateTimelineEventModalComponent,
    EditCardModalComponent,
    CreatePersonModalComponent,
    EditPersonModalComponent,
    CreateNotebookSectionModalComponent,
    EditNotebookSectionModalComponent,
    SortCaseEntitiesModalComponent,
    EditCaseModalComponent,
    DocumentFormModalComponent,
    ExhibitFormModalComponent,
    DocumentFolderModalComponent,
    DeleteFolderModalComponent,
    DeleteDocumentModalComponent,
    InvitePeopleModalComponent,
    ConfirmationDialogModalComponent,
    EditParticipantModalComponent,
    InviteParticipantModalComponent,
    ModalComponent,
    TasksFormModalComponent,
  ],
  imports: [
    CommonModule,
    BtnModule,
    ReactiveFormsModule,
    GetObjKeysPipe,
    FormsModule,
    AddNoteComponent,
    AsidePanelHeaderComponent,
    AddContentBtnComponent,
    UploadFileControlComponent,
    UserCommentComponent,
    AddCommentFormComponent,
    DocumentCardComponent,
    TagComponent,
    TextEditorComponent,
    SortableModule,
    BsDropdownModule,
    MatAutocompleteModule,
    CdkDropList,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    SortByOrderPipe,
    SelectComponent,
  ],
  exports: [
    ModalComponent,
  ],
})
export class ModalsModule { }
