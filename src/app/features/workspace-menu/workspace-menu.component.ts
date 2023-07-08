import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrialCasesService } from '../../core/services/trial-cases/trial-cases.service';
import { AppRoutes } from '../../models/enums/app-routes';
import { WorkspaceRoutes } from '../../models/enums/workspace-routes';
import { EditCaseModalComponent } from '../modals/components/edit-case-modal/edit-case-modal.component';
import { Modal } from '../../models/enums/modal';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'lr-workspace-menu',
  templateUrl: './workspace-menu.component.html',
  styleUrls: ['./workspace-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceMenuComponent {
  appRoutes = AppRoutes;
  workspaceRoutes = WorkspaceRoutes;
  selectedCase$ = this.casesSrv.selectedTrialCase$;

  constructor(
    private casesSrv: TrialCasesService,
    private bsModalService: BsModalService,
  ) { }

  openEditCaseModal(caseId: string): void {
    this.bsModalService.show(EditCaseModalComponent, {
      class: 'modal-dialog-centered',
      id: Modal.EditCase,
      initialState: {
        caseId,
      },
      keyboard: true,
    });
  }
}
