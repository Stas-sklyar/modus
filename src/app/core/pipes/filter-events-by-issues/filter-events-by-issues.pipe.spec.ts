import { FilterEventsByIssuesPipe } from './filter-events-by-issues.pipe';

describe('FilterEventsByIssuesPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterEventsByIssuesPipe();
    expect(pipe).toBeTruthy();
  });
});
