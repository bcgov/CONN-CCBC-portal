import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const SortArrowsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  width: 1.25em;
`;

interface Props {
  sortDirection: 'ascending' | 'descending' | 'none';
}

function sortColor(isActive: boolean) {
  if (isActive) {
    return '#3D9B50';
  }
  return '#939393';
}

const SortArrows: React.FC<Props> = ({ sortDirection }) => {
  const sortAscending = sortDirection === 'ascending';
  const sortDescending = sortDirection === 'descending';
  return (
    <SortArrowsContainer>
      <FontAwesomeIcon
        viewBox="0 0 320 360"
        style={{ color: sortColor(sortDescending) }}
        icon={faSortUp}
        size="xl"
      />
      <FontAwesomeIcon
        style={{ color: sortColor(sortAscending) }}
        icon={faSortDown}
        size="xl"
        viewBox="0 350 320 360"
      />
    </SortArrowsContainer>
  );
};

export default SortArrows;
