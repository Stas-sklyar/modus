import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CaseHeaderComponent } from '../../shared/components/case-header/case-header.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { CaseNarrativeComponent } from './components/case-narrative/case-narrative.component';
import { PeopleComponent } from './components/people/people.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { CaseTimelineComponent } from './components/case-timeline/case-timeline.component';
import { TrialNotebookComponent } from './components/trial-notebook/trial-notebook.component';
import { WorkbookComponent } from './components/workbook/workbook.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkbookFolderComponent } from './components/workbook-folder/workbook-folder.component';
import { RecentActivitiesComponent } from './components/recent-activities/recent-activities.component';
import { WorkbookSectionComponent } from './components/workbook-section/workbook-section.component';
import { WorkbookSubsectionComponent } from './components/workbook-subsection/workbook-subsection.component';
import { CardComponent } from './components/card/card.component';
import { BtnModule } from '../../shared/components/btn/btn.module';
import { InvertArrowComponent } from '../../core/components/invert-arrow/invert-arrow.component';
import { ClipActivityListPipe } from '../../shared/pipes/clip-activity-list/clip-activity-list.pipe';
import { AutoFocusDirective } from '../../shared/directives/auto-focus/auto-focus.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { WorkspaceMenuComponent } from '../workspace-menu/workspace-menu.component';
import { CaseTimelineCardComponent } from './components/case-timeline-card/case-timeline-card.component';
import { RecentActivitiesCardsComponent } from './components/recent-activities-cards/recent-activities-cards.component';
import { CaseNarrativeStoryComponent } from './components/case-narrative-story/case-narrative-story.component';
import { CaseTimelineFiltersComponent } from './components/case-timeline/case-timeline-filters/case-timeline-filters.component';
import { ModalsModule } from '../modals/modals.module';
import {
  NarrativeStoryItemComponent,
} from './components/narrative-story-item/narrative-story-item.component';
import { CardChipComponent } from '../../core/components/card-chip/card-chip.component';
import { TimelineEventPreviewModule } from '../timeline-event-preview/timeline-event-preview.module';
import { CaseNarrativeStoryPreviewModule } from '../case-narrative-story-preview/case-narrative-story-preview.module';
import { PersonPreviewModule } from '../person-preview/person-preview.module';
import { ExpandableRowComponent } from '../../core/components/expandable-row/expandable-row.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import {
  ApplyRedirectsToMentionsDirective,
} from '../../core/directives/apply-redirects-to-mentions/apply-redirects-to-mentions.directive';
import { SafeHtmlPipe } from '../../core/pipes/safe-html/safe-html.pipe';
import { GetInitialsPipe } from '../../core/pipes/get-initials/get-initials.pipe';
import { DocumentsFolderComponent } from '../../core/components/documents-folder/documents-folder.component';
import { SortableHeaderDirective } from '../../core/directives/sortable-header/sortable-header.directive';
import { DocumentPreviewModule } from '../document-preview/document-preview.module';
import { SearchAutocompleteComponent } from '../../core/components/search-autocomplete/search-autocomplete.component';
import { SelectComponent } from '../../core/components/select/select.component';
import { SortByOrderPipe } from '../../shared/pipes/sort-by-order/sort-by-order.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { DocumentsTotalAmountPipe } from '../../core/pipes/documents-total-amount/documents-total-amount.pipe';
import { CardPreviewModule } from '../card-preview/card-preview.module';
import { AsidePanelComponent } from '../../core/components/aside-panel/aside-panel.component';
import { TaskPreviewModule } from '../task-preview/task-preview.module';
import { TasksFilterFormComponent } from './components/tasks/tasks-filter-form/tasks-filter-form.component';
import { GroupEventsByYearPipe } from '../../core/pipes/group-events-by-year/group-events-by-year.pipe';
import {
  FilterEventsBySearchQueryPipe,
} from '../../core/pipes/filter-events-by-search-query/filter-events-by-search-query.pipe';
import { FilterEventsByIssuesPipe } from '../../core/pipes/filter-events-by-issues/filter-events-by-issues.pipe';
import { FilterEventsByPeoplePipe } from '../../core/pipes/filter-events-by-people/filter-events-by-people.pipe';
import {
  FilterEventsByPartyTypePipe,
} from '../../core/pipes/filter-events-by-party-type/filter-events-by-party-type.pipe';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { TimeAgoPipe } from '../../core/pipes/time-ago/time-ago.pipe';
import {
  FilterTasksBySearchQueryPipe,
} from '../../core/pipes/filter-tasks-by-search-query.ts/filter-tasks-by-search-query.pipe';
import { FilterTasksByDueDatePipe } from '../../core/pipes/filter-tasks-by-due-date/filter-tasks-by-due-date.pipe';
import {
  FilterGroupedByStatusTasksBySearchQueryPipe,
} from '../../core/pipes/filter-grouped-by-status-tasks-by-search-query/filter-grouped-by-status-tasks-by-search-query.pipe';
import {
  FilterGroupedByStatusTasksByDueDatePipe,
} from '../../core/pipes/filter-grouped-by-status-tasks-by-due-date/filter-grouped-by-status-tasks-by-due-date.pipe';
import { AssignedToUserIdTasksPipe } from '../../core/pipes/assigned-to-user-id-tasks/assigned-to-user-id-tasks.pipe';

@NgModule({
  declarations: [
    WorkspaceComponent,
    WorkbookComponent,
    CaseTimelineComponent,
    CaseNarrativeComponent,
    TrialNotebookComponent,
    TasksComponent,
    DocumentsComponent,
    PeopleComponent,
    WorkbookFolderComponent,
    RecentActivitiesComponent,
    WorkbookSectionComponent,
    WorkbookSubsectionComponent,
    CardComponent,
    CaseTimelineCardComponent,
    RecentActivitiesCardsComponent,
    CaseNarrativeStoryComponent,
    CaseTimelineFiltersComponent,
    NarrativeStoryItemComponent,
    TasksFilterFormComponent,
    WorkspaceMenuComponent,
  ],
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    CaseHeaderComponent,
    InvertArrowComponent,
    BtnModule,
    ClipActivityListPipe,
    AutoFocusDirective,
    ReactiveFormsModule,
    ModalsModule,
    CardChipComponent,
    TimelineEventPreviewModule,
    CaseNarrativeStoryPreviewModule,
    PersonPreviewModule,
    ExpandableRowComponent,
    BsDropdownModule,
    ApplyRedirectsToMentionsDirective,
    SafeHtmlPipe,
    GetInitialsPipe,
    DocumentsFolderComponent,
    SortableHeaderDirective,
    DocumentPreviewModule,
    SearchAutocompleteComponent,
    SelectComponent,
    SortByOrderPipe,
    MatAutocompleteModule,
    MatInputModule,
    DocumentsTotalAmountPipe,
    CardPreviewModule,
    AsidePanelComponent,
    TaskPreviewModule,
    GroupEventsByYearPipe,
    FilterEventsBySearchQueryPipe,
    FilterEventsByIssuesPipe,
    FilterEventsByPeoplePipe,
    FilterEventsByPartyTypePipe,
    SortableModule,
    TimeAgoPipe,
    FilterTasksBySearchQueryPipe,
    FilterTasksByDueDatePipe,
    FilterGroupedByStatusTasksBySearchQueryPipe,
    FilterGroupedByStatusTasksByDueDatePipe,
    AssignedToUserIdTasksPipe,
  ],
})
export class WorkspaceModule { }
