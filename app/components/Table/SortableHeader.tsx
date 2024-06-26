import { useMemo } from 'react';
import {
  faSort,
  faCaretUp,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import SortArrows from './SortArrows';

const StyledTableHeadCell = styled('th')`
  border-top: 1px solid hsla(0, 0%, 0%, 0.12);

  &:last-child {
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
`;

const StyledTextContainer = styled('div')`
  display: flex;
  align-items: baseline;
`;

interface Props {
  orderByPrefix?: string;
  displayName: string;
  sortable?: boolean;
  loading?: boolean;
  onRouteUpdate: (url: any, mode: 'replace' | 'push') => void;
}

const SORT_DIRECTIONS = {
  none: {
    icon: faSort,
  },
  ascending: {
    icon: faCaretDown,
    orderBySuffix: '_ASC',
  },
  descending: {
    icon: faCaretUp,
    orderBySuffix: '_DESC',
  },
};

const SortableHeader: React.FC<Props> = ({
  orderByPrefix,
  displayName,
  sortable,
  loading,
  onRouteUpdate,
}) => {
  const router = useRouter();

  const sortDirection = useMemo(() => {
    const { orderBy } = router.query;
    if (
      !sortable ||
      !orderBy ||
      !(orderBy as string).startsWith(orderByPrefix)
    ) {
      return 'none';
    }

    if ((orderBy as string).endsWith('_ASC')) {
      return 'ascending';
    }

    return 'descending';
  }, [router.query, orderByPrefix, sortable]);

  const handleClick = () => {
    const newSortDirection =
      sortDirection === 'none' || sortDirection === 'descending'
        ? 'ascending'
        : 'descending';

    const url = {
      pathname: router.pathname,
      query: {
        ...router.query,
        orderBy:
          orderByPrefix + SORT_DIRECTIONS[newSortDirection].orderBySuffix,
      },
    };

    onRouteUpdate(url, 'replace');
  };
  return (
    <StyledTableHeadCell
      onClick={() => sortable && handleClick()}
      aria-sort={sortDirection}
      className={loading ? 'loading' : ''}
      aria-disabled={loading}
    >
      <StyledTextContainer aria-sort={sortDirection}>
        {displayName}&nbsp;
        {sortable && <SortArrows sortDirection={sortDirection} />}
      </StyledTextContainer>
    </StyledTableHeadCell>
  );
};

export default SortableHeader;
