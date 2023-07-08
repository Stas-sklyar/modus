import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortableHeaderDirective } from '../../../../core/directives/sortable-header/sortable-header.directive';
import { TableSortEvent } from '../../../../models/interfaces/table-sort-event';
import {
  BehaviorSubject,
  combineLatest,
  map,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { UsersService } from '../../../../core/services/users/users.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../../models/interfaces/user';
import { GetInitialsPipe } from '../../../../core/pipes/get-initials/get-initials.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RegistrationService } from '../../../../core/services/registration/registration.service';
import { NotificationsService } from '../../../../core/services/notifications/notifications.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import { ClipListPipe } from '../../../../core/pipes/clip-list/clip-list.pipe';
import { Modal } from '../../../../models/enums/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ConfirmationDialogModalComponent,
} from '../../../modals/components/confirmation-dialog-modal/confirmation-dialog-modal.component';
import {
  EditParticipantModalComponent,
} from '../../../modals/components/edit-participant-modal/edit-participant-modal.component';

type TypeFilter = 'mine' | 'all';
const FILTER_SLICE_SIZE = 5;

@Component({
  selector: 'lr-participants',
  standalone: true,
  imports: [CommonModule, SortableHeaderDirective, ReactiveFormsModule, GetInitialsPipe, BsDropdownModule, ClipListPipe],
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsComponent implements OnInit, OnDestroy {
  @ViewChildren(SortableHeaderDirective) headers!: QueryList<SortableHeaderDirective>;
  searchFilter$ = new FormControl('');
  typeFilter$ = new BehaviorSubject<TypeFilter>('mine');
  private _titleFilter$ = new SelectionModel<string>(true, []);
  get titleFilter$(): string[] {
    return this._titleFilter$.selected;
  }
  set titleFilter(value: string) {
    this._titleFilter$.toggle(value);
  }
  private _trialCaseFilter$ = new SelectionModel<string>(true, []);
  get trialCaseFilter$(): string[] {
    return this._trialCaseFilter$.selected;
  }
  set trialCaseFilter(value: string) {
    this._trialCaseFilter$.toggle(value);
  }
  caseFilterSliceSize: number | undefined = FILTER_SLICE_SIZE;
  titleFilterSliceSize: number | undefined = FILTER_SLICE_SIZE;
  availableTitles: string[] | null = null;
  usersSorter$ = new BehaviorSubject<TableSortEvent | null>(null);
  trialCases$ = this.trialCasesService.trialCases$;
  users$ = combineLatest([
    this.usersService.users$,
    this.searchFilter$.valueChanges.pipe(startWith('')),
    this.typeFilter$,
    this.usersSorter$,
    this._titleFilter$.changed.pipe(startWith('')),
    this._trialCaseFilter$.changed.pipe(startWith('')),
  ]).pipe(
    tap(([users]) => {
      if (!users) return;
      const allTitles = users.map(user => user.title);
      this.availableTitles = [...new Set(allTitles.map(i => i.toLowerCase()))];
    }),
    map(([ users, searchFilter, typeFilter, sorter ]) => {
      if (!users) return [];
      const filteredUsers = this.applyFilters(users, searchFilter, typeFilter);
      const sortedUsers = this.applySorting(filteredUsers, sorter);
      return sortedUsers as User[];
    }),
  );
  private unsubscribe$ = new Subject<void>();

  constructor(
    private usersService: UsersService,
    private registrationService: RegistrationService,
    private notificationService: NotificationsService,
    private router: Router,
    private trialCasesService: TrialCasesService,
    private bsModalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.getParticipants();
    this.getTrialCases();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeSliceSize(filter: 'case' | 'title'): void {
    if (filter === 'case') {
      this.caseFilterSliceSize = this.caseFilterSliceSize ? undefined : FILTER_SLICE_SIZE;
    } else {
      this.titleFilterSliceSize = this.titleFilterSliceSize ? undefined : FILTER_SLICE_SIZE;
    }
  }

  onSort(sortEvent: TableSortEvent): void {
    this.resetSortableHeaders(sortEvent);
    this.usersSorter$.next(sortEvent);
  }

  sendInviteToUser(user: User): void {
    const { name, title, email } = user;
    if (!title || !email) return;
    this.registrationService.invitePerson(email, title, null)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.notificationService.notifySuccess(`User ${ name } have been invited via email`);
      });
  }

  openEditUserModal(user: User): void {
    this.bsModalService.show(EditParticipantModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditParticipant,
      initialState: {
        user,
      },
      keyboard: true,
    });
  }

  deleteUser(user: User): void {
    const hasRelationToCases = this.usersService.hasRelationToCases(user);

    this.bsModalService.show(ConfirmationDialogModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.DeleteParticipant,
      initialState: {
        ...(hasRelationToCases && {
          title: null,
          content: 'You cannot delete this user since it contains cases or tasks.',
          confirmButtonText: null,
          cancelButtonText: 'OK',
        }),
      },
      keyboard: true,
    }).content?.confirm
      .pipe(
        switchMap(() => this.usersService.removeParticipant(user.id)),
        switchMap(() => this.usersService.getUsers()),
        takeUntil(this.unsubscribe$),
      )
      .subscribe(() => {
        this.notificationService.notifySuccess(`User ${ user.name } has been removed`);
      });
  }

  openParticipantPanel(user: User): void {
    this.router.navigate([], { queryParams: {
      participantId: user.id, backTo: 'Back to people',
    } });
  }

  getRelatedCases(user: User): { name: string, amount: number } | null {
    const cases = this.usersService.getBelongsToUserCases(user);
    if (!cases.length) return null;

    return {
      name: cases[0].name,
      amount: cases.length - 1,
    };
  }

  private getParticipants(): void {
    this.usersService.getUsers()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  private applyFilters(
    users: User[],
    searchFilter: string | null,
    typeFilter: TypeFilter,
  ): User[] {
    return users
      .filter(user => {
        if (!searchFilter) return user;

        return this.findUserByNameOrEmail(user, searchFilter);
      })
      .filter(user => {
        switch (typeFilter) {
          case 'mine':
            return user;
          case 'all':
            return user;
          default:
            return user;
        }
      })
      .filter(user => {
        if (!this.titleFilter$.length) return true;
        const match = this.titleFilter$.find(title => user.title.toLowerCase() === title.toLowerCase());
        return match || false;
      })
      .filter(user => {
        if (!this.trialCaseFilter$.length) return true;
        const relatedCases = this.usersService.getBelongsToUserCases(user);
        if (!relatedCases.length) return false;
        const match = relatedCases.some(trialCase => this.trialCaseFilter$.some(id => (id === trialCase.id)));
        return match || false;
      });
  }

  private applySorting(
    users: User[],
    sorter: TableSortEvent | null,
  ): User[] {
    if (!sorter) return users;
    if (!sorter.column || !sorter.direction) return users;

    return users.sort((a, b) => {
      let compareIndex;
      switch (sorter.column) {
        case 'name':
          compareIndex = this.compareAlphabetically(a.name, b.name);
          break;
        case 'title':
          compareIndex = this.compareAlphabetically(a.title, b.title);
          break;
        default:
          compareIndex = this.compareAlphabetically(a.name, b.name);
      }
      return sorter.direction === 'asc' ? compareIndex : -compareIndex;
    });
  }

  private findUserByNameOrEmail(user: User, searchFilter: string): boolean {
    return user.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (user.email?.toLowerCase().includes(searchFilter.toLowerCase()) || false);
  }

  private compareAlphabetically(value1: string, value2: string): number {
    const v1 = value1.toLowerCase();
    const v2 = value2.toLowerCase();
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  private resetSortableHeaders(sortEvent: TableSortEvent): void {
    this.headers.forEach((header) => {
      if (header.column !== sortEvent.column) {
        header.direction = '';
      }
    });
  }

  private getTrialCases(): void {
    this.trialCasesService.getTrialCases()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }
}
