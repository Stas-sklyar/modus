export interface EditingNote {
  id: string;
  title: string;
  description: string | null;
  personMentions: { trialCasePersonId: string }[];
}
