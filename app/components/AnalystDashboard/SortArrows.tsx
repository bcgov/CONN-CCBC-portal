import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const SortArrowsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 1.25em;
  align-items: stretch;
`;

interface Props {
  sortDirection: 'ascending' | 'descending' | 'none';
}

function sortColor(isActive: boolean) {
  if (isActive) {
    return '#3D9B50';
  }
  return '939393';
}

const SortArrows: React.FC<Props> = ({ sortDirection }) => {
  const sortAscending = sortDirection === 'ascending';
  const sortDescending = sortDirection === 'descending';
  return (
    <SortArrowsContainer>
      <FontAwesomeIcon
        style={{ color: sortColor(sortAscending) }}
        icon={faSortUp}
        size="xl"
      />
      <FontAwesomeIcon
        style={{ color: sortColor(sortDescending) }}
        icon={faSortDown}
        size="xl"
      />
    </SortArrowsContainer>
  );
};

export default SortArrows;
