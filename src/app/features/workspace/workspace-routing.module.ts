import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppRoutes } from '../../models/enums/app-routes';
import { WorkspaceRoutes } from '../../models/enums/workspace-routes';
import { DocumentsComponent } from './components/documents/documents.component';
import { CaseNarrativeComponent } from './components/case-narrative/case-narrative.component';
import { PeopleComponent } from './components/people/people.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { CaseTimelineComponent } from './components/case-timeline/case-timeline.component';
import { TrialNotebookComponent } from './components/trial-notebook/trial-notebook.component';
import { WorkbookComponent } from './components/workbook/workbook.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkbookSectionComponent } from './components/workbook-section/workbook-section.component';
import { MainRoutes } from '../../models/enums/main-routes';

const routes: Routes = [
  {
    path: WorkspaceRoutes.TRIAL_CASE_ID,
    component: WorkspaceComponent,
    children: [
      {
        path: WorkspaceRoutes.WORKBOOK,
        children: [
          {
            path: WorkspaceRoutes.EMPTY,
            component: WorkbookComponent,
          },
          {
            path: WorkspaceRoutes.FOLDER_ID_SECTION_ID,
            component: WorkbookSectionComponent,
          },
        ],
      },
      {
        path: WorkspaceRoutes.CASE_TIMELINE,
        component: CaseTimelineComponent,
      },
      {
        path: WorkspaceRoutes.CASE_NARRATIVE,
        component: CaseNarrativeComponent,
      },
      {
        path: WorkspaceRoutes.TRIAL_NOTEBOOK,
        component: TrialNotebookComponent,
      },
      {
        path: WorkspaceRoutes.CASE_TASKS,
        component: TasksComponent,
      },
      {
        path: WorkspaceRoutes.CASE_DOCUMENTS,
        component: DocumentsComponent,
      },
      {
        path: WorkspaceRoutes.CASE_PEOPLE,
        component: PeopleComponent,
      },
      {
        path: '**',
        redirectTo: WorkspaceRoutes.WORKBOOK,
      },
    ],
  },
  {
    path: '**',
    redirectTo: `/${AppRoutes.MAIN}/${MainRoutes.DASHBOARD}`,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkspaceRoutingModule {}
