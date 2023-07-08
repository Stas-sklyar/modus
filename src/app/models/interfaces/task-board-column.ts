import { TrialCaseTask } from './trial-case-task';


export interface TaskBoardColumn {
  columnTitle: string;
  tasks: TrialCaseTask[];
  status: string;
  amountOfTasks: number;
}
