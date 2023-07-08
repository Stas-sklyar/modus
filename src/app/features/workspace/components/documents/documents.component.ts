import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, startWith, Subscription } from 'rxjs';
import { DocumentsService } from '../../../../core/services/documents/documents.service';
import { SortableHeaderDirective } from '../../../../core/directives/sortable-header/sortable-header.directive';
import { TableSortEvent } from '../../../../models/interfaces/table-sort-event';
import { Modal } from '../../../../models/enums/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DocumentFormModalComponent } from '../../../modals/components/document-form-modal/document-form-modal.component';
import { DocumentFolderModalComponent } from '../../../modals/components/document-folder-modal/document-folder-modal.component';
import { Document, WithDividedStamps } from '../../../../models/interfaces/document';
import {
  DeleteFolderModalComponent,
} from '../../../modals/components/delete-folder-modal/delete-folder-modal.component';
import { DocumentFolder } from '../../../../models/interfaces/document-folder';
import { WithCounters } from '../../../../models/interfaces/withCounters';
import { FormControl } from '@angular/forms';


type TypeFilter = 'View All' | 'Document' | 'Exhibit';

@Component({
  selector: 'lr-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsComponent implements OnInit, OnDestroy {
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;

  caseId = this.route.parent?.snapshot.paramMap.get('caseId');
  selectedCase$ = this.trialCasesService.selectedTrialCase$;
  folders$ = this.documentsService.documentFolders$;
  documentsSorter$ = new BehaviorSubject<TableSortEvent | null>(null);
  selectedFolder$ = this.documentsService.selectedFolder$;
  searchFilter$ = new FormControl('');
  typeFilter$ = new BehaviorSubject<TypeFilter>('View All');
  documents$ = combineLatest([
    this.documentsService.documents$.pipe(
      map((documents) => {
        if (!documents) return [] as (Document & WithDividedStamps)[];
        return documents.map(i => {
          const isExhibit = this.isExhibit(i);
          return { ...i, batesStamp: isExhibit ? null : i.batesNumber, exhibitStamp: isExhibit ? i.batesNumber : null };
        }) as (Document & WithDividedStamps)[];
      }),
    ),
    this.searchFilter$.valueChanges.pipe(startWith('')),
    this.typeFilter$,
    this.documentsSorter$,
  ]).pipe(
    map(([ documents, searchFilter, typeFilter, sorter ]) => {
      if (!documents) return [] as (Document & WithDividedStamps)[];
      const filteredDocuments = this.applyFilters(documents, searchFilter, typeFilter);
      const sortedDocuments = this.applySorting(filteredDocuments, sorter);
      return sortedDocuments as (Document & WithDividedStamps)[];
    }),
  );
  private _subscription = new Subscription();

  constructor(
    private trialCasesService: TrialCasesService,
    private route: ActivatedRoute,
    private router: Router,
    private documentsService: DocumentsService,
    private bsModalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.getFolders();
    this.getDocuments(null);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this.documentsService.cleanMediaLibrary();
  }

  isExhibit(document: Document): boolean {
    return !!document.documentParentId;
  }

  selectFolder(folder: (DocumentFolder & WithCounters) | null): void {
    this.documentsService.selectedFolder = folder;
    this.getDocuments(folder?.id || null);
  }

  onSort(sortEvent: TableSortEvent): void {
    this.resetSortableHeaders(sortEvent);
    this.documentsSorter$.next(sortEvent);
  }

  openDocumentFolderModal(action: 'create' | 'edit'): void {
    console.log('fol', this.documentsService.selectedFolder);
    const folder = this.documentsService.selectedFolder;
    this.bsModalService.show(DocumentFolderModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.DocumentFolder,
      initialState: {
        action,
        folder,
      },
      keyboard: true,
    });
  }

  openDeleteFolderModal(): void {
    const folder = this.documentsService.selectedFolder;
    if (folder) {
      this.bsModalService.show(DeleteFolderModalComponent, {
        class: 'modal-dialog-centered',
        id: Modal.DeleteFolder,
        initialState: {
          folder,
        },
        keyboard: true,
      });
    }
  }

  openAddDocumentModal(): void {
    this.bsModalService.show(DocumentFormModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.Document,
      initialState: {},
      keyboard: true,
    });
  }

  openDocumentPreview(document: Document): void {
    this.router.navigate([], { queryParams: {
      documentId: document.id, backTo: 'Back to Documents',
    } });
  }

  private applyFilters(
    documents: (Document & WithDividedStamps)[],
    searchFilter: string | null,
    typeFilter: TypeFilter,
  ): (Document & WithDividedStamps)[] {
    return documents
      .filter(document => {
        if (!searchFilter) return document;

        return document.title.toLowerCase().includes(searchFilter.toLowerCase());
      })
      .filter(document => {
        switch (typeFilter) {
          case 'View All':
            return document;
          case 'Document':
            return !this.isExhibit(document);
          case 'Exhibit':
            return this.isExhibit(document);
          default:
            return document;
        }
      });
  }

  private applySorting(
    documents: (Document & WithDividedStamps)[],
    sorter: TableSortEvent | null,
  ): (Document & WithDividedStamps)[] {
    if (!sorter) return documents;
    if (!sorter.column || !sorter.direction) return documents;

    return documents.sort((a, b) => {
      let compareIndex;
      switch (sorter.column) {
        case 'title':
          compareIndex = this.compareByTitle(a, b);
          break;
        case 'createdDateTime':
          compareIndex = this.compareByDate(a, b);
          break;
        case 'batesStamp':
          compareIndex = this.compareByBatesStamp(a, b);
          break;
        case 'exhibitStamp':
          compareIndex = this.compareByExhibitStamp(a, b);
          break;
        default:
          compareIndex = this.compareByDate(a, b);
      }
      return sorter.direction === 'asc' ? compareIndex : -compareIndex;
    });
  }

  private compareByDate(value1: Document, value2: Document): number {
    const v1 = new Date(value1.createdDateTime).getTime();
    const v2 = new Date(value2.createdDateTime).getTime();
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private compareByTitle(value1: Document, value2: Document): number {
    const v1 = value1.title.toLowerCase();
    const v2 = value2.title.toLowerCase();
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private compareByBatesStamp(value1: Document & WithDividedStamps, value2: Document & WithDividedStamps): number {
    const v1 = value1.batesStamp || '';
    const v2 = value2.batesStamp || '';
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private compareByExhibitStamp(value1: Document & WithDividedStamps, value2: Document & WithDividedStamps): number {
    const v1 = value1.exhibitStamp || '';
    const v2 = value2.exhibitStamp || '';
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private getFolders(): void {
    this._subscription.add(
      this.documentsService.fetchDocumentFolders().subscribe(),
    );
  }

  private getDocuments(id: string | null): void {
    this._subscription.add(
      this.documentsService.fetchAllDocuments(id).subscribe(),
    );
  }

  private resetSortableHeaders(sortEvent: TableSortEvent): void {
    this.headers.forEach((header) => {
      if (header.column !== sortEvent.column) {
        header.direction = '';
      }
    });
  }
}
