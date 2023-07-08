import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantPreviewComponent } from './components/participant-preview/participant-preview.component';
import { ParticipantCasesComponent } from './components/participant-cases/participant-cases.component';
import { ParticipantTasksComponent } from './components/participant-tasks/participant-tasks.component';
import { ParticipantProfileComponent } from './components/participant-profile/participant-profile.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { RouterModule } from '@angular/router';
import { GetInitialsPipe } from '../../core/pipes/get-initials/get-initials.pipe';



@NgModule({
  declarations: [
    ParticipantPreviewComponent,
    ParticipantCasesComponent,
    ParticipantTasksComponent,
    ParticipantProfileComponent,
  ],
  imports: [
    CommonModule,
    BsDropdownModule,
    BtnModule,
    RouterModule,
    GetInitialsPipe,
  ],
  exports: [
    ParticipantPreviewComponent,
  ],
})
export class ParticipantPreviewModule { }
