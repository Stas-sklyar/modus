import { TimelineEvent } from './timeline-event';
import { TrialCasePersonMention } from './trial-case-person-mentions';
import { Company } from './company';
import { DocumentFolder } from './document-folder';
import { TrialCaseFolder } from './trial-case-folder';
import { BaseTrackEntity } from './base-track-entity';
import { UserTrialCaseFavorite } from './user-trial-case-favorite';
import { TrialCasePerson } from './trial-case-person';
import { TrialCaseNotebookSection } from './trial-case-notebook-section';
import { TrialCaseTag } from './trial-case-tag';
import { TrialCaseNarrativeStory } from './trial-case-narrative-story';


export interface TrialCase extends BaseTrackEntity {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  company: Company;
  createdByUserId: string;
  order: number;
  tags: TrialCaseTag[];
  documentFolders: DocumentFolder[];
  folders: TrialCaseFolder[];
  timelineEvents: TimelineEvent[];
  trialCasePersons: TrialCasePerson[];
  userTrialCaseFavorites: UserTrialCaseFavorite[];
  notebookSections: TrialCaseNotebookSection[];
  personMentions: TrialCasePersonMention[];
  trialCaseNarrativeStories: TrialCaseNarrativeStory[];
}
