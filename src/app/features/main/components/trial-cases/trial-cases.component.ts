import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipListPipe } from '../../../../core/pipes/clip-list/clip-list.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TrialCasesService } from '../../../../core/services/trial-cases/trial-cases.service';
import {
  BehaviorSubject,
  startWith,
  Subject,
  combineLatest,
  map,
  Observable,
  switchMap,
  take,
  tap, finalize,
} from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { AppRoutes } from '../../../../models/enums/app-routes';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html/safe-html.pipe';
import { RouterModule } from '@angular/router';
import { TrialCase } from '../../../../models/interfaces';
import { UsersService } from '../../../../core/services/users/users.service';
import { WithFavoriteFlag } from '../../../../models/interfaces/with-favorite-flag';

type TypeFilter = 'mine' | 'favorites' | 'all';
const FILTER_SLICE_SIZE = 3;

@Component({
  selector: 'lr-trial-cases',
  templateUrl: './trial-cases.component.html',
  styleUrls: ['./trial-cases.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ClipListPipe,
    ReactiveFormsModule,
    ApplyRedirectsToMentionsDirective,
    SafeHtmlPipe,
    RouterModule,
  ],
})
export class TrialCasesComponent implements OnInit, OnDestroy {
  @Input() displayAs: 'widget' | 'page' = 'page';

  searchFilter$ = new FormControl('');
  typeFilter$ = new BehaviorSubject<TypeFilter>('mine');
  private _caseStatusFilter$ = new SelectionModel<string>(true, []);
  get caseStatusFilter$(): string[] {
    return this._caseStatusFilter$.selected;
  }
  set caseStatusFilter(value: string) {
    this._caseStatusFilter$.toggle(value);
  }
  appRoutes = AppRoutes;
  unsubscribe$ = new Subject<void>();
  casesListSliceSizeFilter: number | undefined = undefined;
  caseStatusSliceSizeFilter: number | undefined = FILTER_SLICE_SIZE;
  trialCases$ = combineLatest([
    this.trialCasesService.trialCases$
      .pipe(
        map((trialCases) => {
          if (!trialCases) return [] as (TrialCase & WithFavoriteFlag)[];
          return trialCases.map(i => ({
            ...i,
            isFavorite: !!i.userTrialCaseFavorites.length,
          }));
        }),
        tap((trialCases) => {
          this.mineCasesAmount = trialCases.length;
          this.favoriteCasesAmount = trialCases.filter(i => i.isFavorite).length;
        }),
      ),
    this.typeFilter$,
    this.searchFilter$.valueChanges.pipe(startWith('')),
    this._caseStatusFilter$.changed.pipe(startWith('')),
  ]).pipe(
    map(([trialCases, typeFilter, searchFilter ]) => {
      if (!trialCases) return [] as (TrialCase & WithFavoriteFlag)[];
      const filteredCases = this.applyFilters(trialCases, typeFilter, searchFilter);
      return filteredCases as (TrialCase & WithFavoriteFlag)[];
    }),
  );
  mineCasesAmount = 0;
  favoriteCasesAmount = 0;
  inProcess = false;


  constructor(
    private trialCasesService: TrialCasesService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.loadAllTrialCases().subscribe();
    this.setInitialListFilterValue();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeSliceSize(filter: 'cases' | 'status'): void {
    if (filter === 'cases') {
      this.casesListSliceSizeFilter = this.casesListSliceSizeFilter ? undefined : FILTER_SLICE_SIZE;
    } else if (filter === 'status') {
      this.caseStatusSliceSizeFilter = this.caseStatusSliceSizeFilter ? undefined : FILTER_SLICE_SIZE;
    }
  }

  toggleFavoriteState(trialCase: TrialCase & WithFavoriteFlag): void {
    if (this.inProcess) return;

    const { id, isFavorite } = trialCase;
    const favoriteCase = trialCase.userTrialCaseFavorites.find(i => i.trialCase.id === trialCase.id);

    if (isFavorite && favoriteCase) {
      this.removeFromFavorites(favoriteCase.id);
    } else {
      this.addToFavorites(id);
    }
  }

  private addToFavorites(caseId: string): void {
    this.inProcess = true;
    this.trialCasesService.createFavoriteTrialCase(caseId)
      .pipe(
        switchMap(() => this.loadAllTrialCases()),
        take(1),
        finalize(() => {
          this.inProcess = false;
        }),
      )
      .subscribe();
  }

  private removeFromFavorites(caseId: string): void {
    this.inProcess = true;
    this.trialCasesService.deleteFavoriteTrialCase(caseId)
      .pipe(
        switchMap(() => this.loadAllTrialCases()),
        take(1),
        finalize(() => {
          this.inProcess = false;
        }),
      )
      .subscribe();
  }

  private applyFilters(
    trialCases: (TrialCase & WithFavoriteFlag)[],
    typeFilter: TypeFilter,
    searchFilter: string | null,
  ): (TrialCase & WithFavoriteFlag)[] {
    return trialCases
      .filter((trialCase) => {
        if (typeFilter === 'favorites') return trialCase.isFavorite;
        else return trialCase;
      })
      .filter((trialCase) => {
        if (!searchFilter) return trialCase;

        return this.findByNameOrDescription(trialCase, searchFilter);
      });
  }

  private findByNameOrDescription(trialCase: TrialCase, searchFilter: string): boolean {
    return trialCase.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (trialCase.description?.toLowerCase().includes(searchFilter.toLowerCase()) || false);
  }

  private loadAllTrialCases(): Observable<TrialCase[] | null> {
    return this.getUserId()
      .pipe(
        switchMap((userId) => this.trialCasesService.getTrialCases(userId)),
        take(1),
      );
  }

  private getUserId(): Observable<string> {
    return this.usersService.getCurrentAppUser()
      .pipe(map((user) => user.id));
  }

  private setInitialListFilterValue(): void {
    this.casesListSliceSizeFilter = (this.displayAs === 'widget') ? FILTER_SLICE_SIZE : undefined;
  }
}
