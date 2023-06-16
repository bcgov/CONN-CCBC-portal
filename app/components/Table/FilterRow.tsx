import React, { useEffect, useState } from 'react';
import { TableFilter, FilterArgs } from './Filters';

interface Props {
  filters: TableFilter[];
  filterArgs: FilterArgs;
  disabled?: boolean;
  onSubmit: (searchData: Record<string, string | number | boolean>) => void;
}

const FilterRow: React.FunctionComponent<Props> = ({
  filters,
  filterArgs,
  disabled,
  onSubmit,
}) => {
  const [searchFilters, setSearchFilters] = useState(filterArgs);
  useEffect(() => setSearchFilters(filterArgs), [filterArgs]); // reset the local state when the prop changes

  const handleFilterChange = (value, column) => {
    // using a state update with a callback ensures that we always have a reference to the latest searchFilters
    // especially when this handler is fired multiple times in quick sucession, without the component updating
    // which can happen when a single filter component handles multiple variables
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      onSubmit(searchFilters);
    }
  };

  return (
    <tr onKeyDown={handleKeyDown} aria-disabled={disabled}>
      {filters.map((filter) => (
        <filter.Component
          key={filter.argName + filter.title}
          filterArgs={searchFilters}
          disabled={disabled}
          onChange={handleFilterChange}
        />
      ))}
      <style jsx>{`
        .flex {
          display: flex;
        }
      `}</style>
    </tr>
  );
};

export default FilterRow;
