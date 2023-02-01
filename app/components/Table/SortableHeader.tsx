import { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faCaretUp,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const StyledTableHeadCell = styled('th')`
  padding: 12px;

  border-top: 1px solid hsla(0, 0%, 0%, 0.12);

  &:first-child {
    padding: 12px;
  }
  &:last-child {
    padding: 12px;
    box-shadow: none;
  }
  font-weight: bold;

  box-shadow: inset -2px 0px white;
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
      {displayName}&nbsp;
      {sortable && (
        <FontAwesomeIcon
          color="grey"
          size="xl"
          icon={SORT_DIRECTIONS[sortDirection].icon}
        />
      )}
    </StyledTableHeadCell>
  );
};

export default SortableHeader;
