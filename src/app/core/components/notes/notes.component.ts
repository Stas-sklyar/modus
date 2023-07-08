import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnDestroy, OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewNote } from '../../../models/interfaces/new-note';
import { AddNoteComponent } from '../add-note/add-note.component';
import { AddContentBtnComponent } from '../add-content-btn/add-content-btn.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { SafeHtmlPipe } from '../../pipes/safe-html/safe-html.pipe';
import { BtnModule } from '../../../shared/components/btn/btn.module';
import { EditNoteComponent } from '../edit-note/edit-note.component';
import { EditingNote } from '../../../models/interfaces/editing-note';
import { SortByOrderPipe } from '../../../shared/pipes/sort-by-order/sort-by-order.pipe';
import { CaseEntitiesService } from '../../services/case-entities/case-entities.service';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { RelatedDocumentsComponent } from '../related-documents/related-documents.component';
import { Document } from '../../../models/interfaces/document';

@Component({
  selector: 'lr-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SortByOrderPipe, AddNoteComponent, AddContentBtnComponent, ConfirmationModalComponent, SafeHtmlPipe, BtnModule, EditNoteComponent, ApplyRedirectsToMentionsDirective, RelatedDocumentsComponent],
})
export class NotesComponent implements OnInit, OnDestroy {
  @Input() notes: any[] = [];
  @Output() addNoteEvent = new EventEmitter<NewNote>();
  @Output() removeNoteEvent = new EventEmitter<string>();
  @Output() editNoteEvent = new EventEmitter<EditingNote>();
  showAddNoteForm = false;
  indexOfCurrentVisibleAddNoteForm: number | null = null;
  indexOfCurrentVisibleEditNoteForm: number | null = null;
  indexOfCurrentVisibleAddNoteDropdown: number | null = null;
  private _subscription = new Subscription();
  confirmationModalRef?: BsModalRef;
  openedAddContentMenuItemType$ = this.caseEntitiesService.openedAddContentMenuItemType$;

  constructor(
    private notificationsSrv: NotificationsService,

    // TODO: REMOVE PROPERTY
    private el: ElementRef,
    private bsModalService: BsModalService,
    private caseEntitiesService: CaseEntitiesService,
  ) { }

  ngOnInit(): void {
    this.calcVisibilityOfAddNoteForm();

    this.openedAddContentMenuItemType$.subscribe({
      next: (menuItemType: string | null) => {
        if (menuItemType === 'general') {
          this.toggleCreateNoteForm(this.notes.length - 1);
        }
      },
    });
  }

  getRelatedNoteDocuments(note: any): Document[] | null {
    return note.documents?.map((item: any) => item.document) || null;
  }

  calcVisibilityOfAddNoteForm(): void {
    if (!this.notes.length) {
      this.showAddNoteForm = true;
    }
  }

  toggleCreateNoteForm(index: number): void {
    this.indexOfCurrentVisibleAddNoteForm = (this.indexOfCurrentVisibleAddNoteForm !== null && this.indexOfCurrentVisibleAddNoteForm === index) ? null : index;
  }

  toggleEditNoteForm(index: number): void {
    this.indexOfCurrentVisibleAddNoteDropdown = null;
    this.indexOfCurrentVisibleEditNoteForm = (this.indexOfCurrentVisibleEditNoteForm !== null && this.indexOfCurrentVisibleEditNoteForm === index) ? null : index;
  }

  toggleCreateNoteDropdown(index: number): void {
    this.indexOfCurrentVisibleAddNoteDropdown = (this.indexOfCurrentVisibleAddNoteDropdown !== null && this.indexOfCurrentVisibleAddNoteDropdown === index) ? null : index;
  }

  addNote(noteBody: NewNote): void {
    this.showAddNoteForm = false;
    this.caseEntitiesService.openedAddContentMenuItemType = null;

    if (noteBody.title || noteBody.description) {
      this.addNoteEvent.emit(noteBody);
      this.indexOfCurrentVisibleAddNoteForm = null;
    }
  }

  removeNote(noteId: string): void {
    this.indexOfCurrentVisibleAddNoteDropdown = null;
    this.removeNoteEvent.emit(noteId);
  }

  editNote(editedNote: EditingNote): void {
    this.indexOfCurrentVisibleEditNoteForm = null;
    this.editNoteEvent.emit(editedNote);
  }

  uploadDocuments(e: Event): void {
    this.notificationsSrv.notifySuccess('New document added successfully');
    this.indexOfCurrentVisibleAddNoteDropdown = null;
  }

  showConfirmationWindow(template: TemplateRef<any>): void {
    this.confirmationModalRef = this.bsModalService.show(template);
  }

  confirmationCanceled(): void {
    this.confirmationModalRef?.hide();
  }

  confirmationConfirmed(noteId: string): void {
    this.confirmationModalRef?.hide();
    this.removeNote(noteId);
  }

  changeVisibilityOfAddNoteForm(typeOfPressedBtn: 'cancel' | 'confirm'): void {
    if (typeOfPressedBtn === 'cancel') {
      this.indexOfCurrentVisibleAddNoteForm = null;
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.caseEntitiesService.openedAddContentMenuItemType = null;
  }
}
