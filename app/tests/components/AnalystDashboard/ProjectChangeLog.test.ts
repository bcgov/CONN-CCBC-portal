import {
  filterRowById,
  textContainsFilter,
  multiSelectFilter,
  getValueString,
} from 'components/AnalystDashboard/ProjectChangeLog';

// filterRowById
describe('filterRowById', () => {
  describe('empty / whitespace filter', () => {
    it('shows all rows when filter is empty', () => {
      expect(filterRowById('CCBC-001', true, '')).toBe(true);
      expect(filterRowById(null, false, '')).toBe(true);
    });

    it('shows all rows when filter is whitespace only', () => {
      expect(filterRowById('CCBC-001', true, '   ')).toBe(true);
    });
  });

  describe('child row handling', () => {
    it('hides child rows (isVisibleRow=false) when a filter is active', () => {
      expect(filterRowById('CCBC-001', false, 'CCBC')).toBe(false);
    });

    it('shows parent rows (isVisibleRow=true) when they match', () => {
      expect(filterRowById('CCBC-001', true, 'CCBC')).toBe(true);
    });
  });

  describe('null / undefined rowId', () => {
    it('hides rows with null rowId', () => {
      expect(filterRowById(null, true, 'CCBC')).toBe(false);
    });

    it('hides rows with undefined rowId', () => {
      expect(filterRowById(undefined, true, 'CCBC')).toBe(false);
    });

    it('shows rows where rowId is 0 (valid falsy number)', () => {
      expect(filterRowById(0, true, '0')).toBe(true);
    });
  });

  describe('string matching', () => {
    it('matches partial strings case-insensitively', () => {
      expect(filterRowById('CCBC-10001', true, 'ccbc')).toBe(true);
      expect(filterRowById('CCBC-10001', true, '10001')).toBe(true);
    });

    it('hides non-matching rows', () => {
      expect(filterRowById('CCBC-10001', true, 'CCBC-99999')).toBe(false);
    });
  });

  describe('numeric rowId', () => {
    it('converts numeric rowId to string for comparison', () => {
      expect(filterRowById(12345, true, '123')).toBe(true);
      expect(filterRowById(12345, true, '999')).toBe(false);
    });
  });
});

// textContainsFilter
describe('textContainsFilter', () => {
  describe('empty / whitespace filter', () => {
    it('shows all rows when filter is empty', () => {
      expect(textContainsFilter('some value', '')).toBe(true);
      expect(textContainsFilter(null, '')).toBe(true);
    });

    it('shows all rows when filter is whitespace only', () => {
      expect(textContainsFilter('some value', '   ')).toBe(true);
    });
  });

  describe('null / empty value', () => {
    it('hides rows with null value', () => {
      expect(textContainsFilter(null, 'benefits')).toBe(false);
    });

    it('hides rows with undefined value', () => {
      expect(textContainsFilter(undefined, 'benefits')).toBe(false);
    });

    it('hides rows with empty string value', () => {
      expect(textContainsFilter('', 'benefits')).toBe(false);
    });
  });

  describe('string matching', () => {
    it('matches partial strings case-insensitively', () => {
      expect(textContainsFilter('Benefits Summary', 'benefits')).toBe(true);
      expect(textContainsFilter('Benefits Summary', 'SUMMARY')).toBe(true);
    });

    it('hides non-matching rows', () => {
      expect(textContainsFilter('Benefits Summary', 'cost')).toBe(false);
    });
  });

  describe('numeric value', () => {
    it('converts number to string for comparison', () => {
      expect(textContainsFilter(12345, '123')).toBe(true);
      expect(textContainsFilter(12345, '999')).toBe(false);
    });
  });
});

// multiSelectFilter
describe('multiSelectFilter', () => {
  describe('empty selection', () => {
    it('shows all rows when filterValues is empty array', () => {
      expect(multiSelectFilter('rfi', [])).toBe(true);
    });

    it('shows all rows when filterValues is null', () => {
      expect(multiSelectFilter('rfi', null as any)).toBe(true);
    });

    it('shows all rows when filterValues is undefined', () => {
      expect(multiSelectFilter('rfi', undefined as any)).toBe(true);
    });
  });

  describe('matching', () => {
    it('shows rows whose value is in the selected list', () => {
      expect(multiSelectFilter('rfi', ['rfi', 'project'])).toBe(true);
    });

    it('hides rows whose value is not in the selected list', () => {
      expect(multiSelectFilter('claims', ['rfi', 'project'])).toBe(false);
    });

    it('is case-sensitive (values come from the data, not user input)', () => {
      expect(multiSelectFilter('RFI', ['rfi'])).toBe(false);
    });
  });

  describe('single selection', () => {
    it('shows only rows matching the single selected value', () => {
      expect(multiSelectFilter('rfi', ['rfi'])).toBe(true);
      expect(multiSelectFilter('project', ['rfi'])).toBe(false);
    });
  });
});

// getValueString
describe('getValueString', () => {
  describe('valueString takes precedence', () => {
    it('returns valueString when provided', () => {
      expect(getValueString('pre-serialised', { foo: 'bar' })).toBe(
        'pre-serialised'
      );
    });

    it('returns valueString even when it is an empty string', () => {
      expect(getValueString('', { foo: 'bar' })).toBe('');
    });
  });

  describe('object value', () => {
    it('JSON-stringifies plain objects when no valueString', () => {
      expect(getValueString(null, { foo: 'bar' })).toBe('{"foo":"bar"}');
    });

    it('JSON-stringifies nested objects', () => {
      expect(getValueString(undefined, { a: { b: 1 } })).toBe('{"a":{"b":1}}');
    });

    it('returns empty string for null value (null is not a non-null object)', () => {
      expect(getValueString(null, null)).toBe('');
    });
  });

  describe('primitive value', () => {
    it('returns string values as-is', () => {
      expect(getValueString(null, 'hello')).toBe('hello');
    });

    it('returns number values as-is', () => {
      expect(getValueString(null, 42)).toBe(42);
    });

    it('returns empty string for null value', () => {
      expect(getValueString(null, null)).toBe('');
    });

    it('returns empty string for undefined value', () => {
      expect(getValueString(null, undefined)).toBe('');
    });
  });
});
