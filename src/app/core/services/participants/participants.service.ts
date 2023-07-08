import { Injectable } from '@angular/core';
import { BackendApiService } from '../backend-api/backend-api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipantsService {

  constructor(
    private backendApiService: BackendApiService,
  ) {}

}
