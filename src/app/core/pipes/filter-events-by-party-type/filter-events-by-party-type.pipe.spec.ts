import { FilterEventsByPartyTypePipe } from './filter-events-by-party-type.pipe';

describe('FilterEventsByPartyTypePipe', () => {
  it('create an instance', () => {
    const pipe = new FilterEventsByPartyTypePipe();
    expect(pipe).toBeTruthy();
  });
});
