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

const projectTypeFilter = (row, id, filterValue) => {
  if (filterValue.length === 0) {
    return false;
  }
  return filterValue.includes(row.getValue(id));
};

export const additionalFilterColumns = [
  {
    accessorKey: 'projectType',
    header: 'Project Type',
    filterFn: projectTypeFilter,
    visibleInShowHideMenu: false,
    enableHiding: true,
  },
];

const AdditionalFilters = ({ filters, setFilters }) => {
  const projectTypeFilters =
    filters.filter((f) => f.id === 'projectType')?.[0]?.value ?? [];

  const handleProjectTypeFilterChange = (type) => {
    const newFilters = projectTypeFilters.includes(type)
      ? projectTypeFilters.filter((v) => v !== type)
      : [...projectTypeFilters, type];

    setFilters([
      ...filters.filter((f) => f.id !== 'projectType'),
      { id: 'projectType', value: newFilters },
    ]);
  };

  return (
    <StyledDiv>
      <StyledCheckbox
        type="checkbox"
        data-testid="projectTypeFilterCcbc"
        checked={projectTypeFilters.includes('CCBC')}
        onChange={() => handleProjectTypeFilterChange('CCBC')}
      />
      CCBC
      <StyledCheckbox
        type="checkbox"
        data-testid="projectTypeFilterCbc"
        checked={projectTypeFilters.includes('CBC')}
        onChange={() => handleProjectTypeFilterChange('CBC')}
      />
      CBC
      <StyledCheckbox
        type="checkbox"
        data-testid="projectTypeFilterAtlin"
        checked={projectTypeFilters.includes('Atlin')}
        onChange={() => handleProjectTypeFilterChange('Atlin')}
      />
      Atlin
    </StyledDiv>
  );
};

export default AdditionalFilters;
