import { FilterGroupedByStatusTasksByDueDatePipe } from './filter-grouped-by-status-tasks-by-due-date.pipe';

describe('FilterGroupedByStatusTasksByDueDatePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterGroupedByStatusTasksByDueDatePipe();
    expect(pipe).toBeTruthy();
  });
});
