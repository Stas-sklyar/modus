import { FilterTasksByDueDatePipe } from './filter-tasks-by-due-date.pipe';

describe('FilterTasksByTypePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterTasksByDueDatePipe();
    expect(pipe).toBeTruthy();
  });
});
