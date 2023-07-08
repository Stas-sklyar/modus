import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BtnModule } from '../../../shared/components/btn/btn.module';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { SafeHtmlPipe } from '../../pipes/safe-html/safe-html.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-aside-panel-header',
  templateUrl: './aside-panel-header.component.html',
  styleUrls: ['./aside-panel-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, BtnModule, ApplyRedirectsToMentionsDirective, SafeHtmlPipe, BsDropdownModule, ConfirmationModalComponent],
  standalone: true,
})
export class AsidePanelHeaderComponent implements OnChanges {
  @Input() backToBtnLabel = '';
  @Input() title = '';
  @Input() description = '';
  @Input() hideHeaderMenuToggle = false;
  @Input() specificCreateContentItemsList!: string[];
  @Output() editEntity = new EventEmitter();
  @Output() sortNotes = new EventEmitter();
  @Output() createContent: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteEntityEvent = new EventEmitter();
  cardHeaderMenuIsActive: boolean = false;
  confirmationModalRef?: BsModalRef;

  constructor(
    private bsModalService: BsModalService,
    private router: Router,
  ) {}

  ngOnChanges(): void {
    this.cardHeaderMenuIsActive = false;
  }

  onClickAddBtn(): void {
    this.cardHeaderMenuIsActive = !this.cardHeaderMenuIsActive;
  }

  closePanel(): void {
    this.cleanUrlParams();
  }

  openEditEntityModal(): void {
    this.editEntity.emit();
  }

  openCreateContentWindow(menuItemType: string): void {
    this.createContent.emit(menuItemType);
    this.cardHeaderMenuIsActive = !this.cardHeaderMenuIsActive;
  }

  showConfirmationModalForDeletingEntity(confirmationModalTemplate: TemplateRef<any>): void {
    this.confirmationModalRef = this.bsModalService.show(confirmationModalTemplate);
  }

  openSortNotesModal(): void {
    this.sortNotes.emit();
  }

  deletionConfirmationCanceled(): void {
    this.confirmationModalRef?.hide();
  }

  deletionConfirmationConfirmed(): void {
    this.confirmationModalRef?.hide();
    this.deleteEntityEvent.emit();
  }

  private cleanUrlParams(): void {
    this.router.navigate([], {
      queryParams: null,
    });
  }
}
