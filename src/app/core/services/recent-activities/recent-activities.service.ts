import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, share, tap } from 'rxjs';
import { BackendApiService } from '../backend-api/backend-api.service';
import { UserActivityRecord } from '../../../models/interfaces';
import { DataTransformService } from '../data-transform/data-transform.service';

@Injectable({
  providedIn: 'root',
})
export class RecentActivitiesService {

  private _recentActivities$ = new BehaviorSubject<UserActivityRecord[] | null>(null);

  constructor(
    private apiSrv: BackendApiService,
    private dataTransformSrv: DataTransformService,
  ) { }

  loadActivities(): Observable<UserActivityRecord[]> {
    return this.fetchRecentActivities()
      .pipe(
        tap((res: UserActivityRecord[]) => this.recentActivities = res),
      );
  }

  get recentActivities$(): Observable<UserActivityRecord[] | null> {
    return this._recentActivities$
      .asObservable()
      .pipe(share());
  }
  set recentActivities(
    activities: UserActivityRecord[] | null,
  ) {
    this._recentActivities$.next(activities);
  }

  private fetchRecentActivities(): Observable<UserActivityRecord[]> {
    return this.apiSrv.recentActivities()
      .pipe(
        map((res) => res.recentActivities),
      );
  }
}
