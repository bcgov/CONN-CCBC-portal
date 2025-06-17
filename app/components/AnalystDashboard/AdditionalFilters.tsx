import styled from 'styled-components';

const StyledCheckbox = styled.input`
  transform: scale(1.5);
  transform-origin: left;
  cursor: pointer;
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const programFilter = (row, id, filterValue) => {
  if (filterValue.length === 0) {
    return false;
  }
  return filterValue.includes(row.getValue(id));
};

export const additionalFilterColumns = [
  {
    accessorKey: 'program',
    header: 'Program',
    filterFn: programFilter,
    visibleInShowHideMenu: false,
    enableHiding: true,
  },
];

const AdditionalFilters = ({ filters, setFilters, disabledFilters = [] }) => {
  const programFilters =
    filters.filter((f) => f.id === 'program')?.[0]?.value ?? [];

  const disabledProgramFilters =
    disabledFilters.filter((f) => f.id === 'program')?.[0]?.value ?? [];

  const handleProgramFilterChange = (program) => {
    const newFilters = programFilters.includes(program)
      ? programFilters.filter((v) => v !== program)
      : [...programFilters, program];

    setFilters([
      ...filters.filter((f) => f.id !== 'program'),
      { id: 'program', value: newFilters },
    ]);
  };

  return (
    <StyledDiv>
      <StyledCheckbox
        type="checkbox"
        data-testid="programFilterCcbc"
        checked={programFilters.includes('CCBC')}
        disabled={disabledProgramFilters.includes('CCBC')}
        onChange={() => handleProgramFilterChange('CCBC')}
      />
      CCBC
      <StyledCheckbox
        type="checkbox"
        data-testid="programFilterCbc"
        checked={programFilters.includes('CBC')}
        disabled={disabledProgramFilters.includes('CBC')}
        onChange={() => handleProgramFilterChange('CBC')}
      />
      CBC
      <StyledCheckbox
        type="checkbox"
        data-testid="programFilterOther"
        checked={programFilters.includes('OTHER')}
        disabled={disabledProgramFilters.includes('OTHER')}
        onChange={() => handleProgramFilterChange('OTHER')}
      />
      OTHER
    </StyledDiv>
  );
};

export default AdditionalFilters;
