import { FilterTasksBySearchQueryPipe } from './filter-tasks-by-search-query.pipe';

describe('FilterTasksBySearchQueryPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterTasksBySearchQueryPipe();
    expect(pipe).toBeTruthy();
  });
});
