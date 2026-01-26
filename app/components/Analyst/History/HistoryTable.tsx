import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { HistoryTable_query$key } from '__generated__/HistoryTable_query.graphql';
import { useMemo, useState } from 'react';
import { processHistoryItems } from 'utils/historyProcessing';
import HistoryRow from './HistoryRow';
import HistoryFilter, {
  filterByType,
  filterByUser,
  getTypeOptions,
  getUserOptions,
} from './HistoryFilter';

const StyledTable = styled.table`
  border: none;
  table-layout: fixed;
  margin-left: 8px;

  & td {
    padding-top: 0;
    padding-bottom: 16px;
  }

  & tr:last-child {
    & td:first-child {
      border: none;
    }
    td {
      padding-bottom: 0px;
    }
  }
`;

interface Props {
  query: any;
}

const HistoryTable: React.FC<Props> = ({ query }) => {
  const queryFragment = useFragment<HistoryTable_query$key>(
    graphql`
      fragment HistoryTable_query on Query {
        applicationByRowId(rowId: $rowId) {
          history {
            nodes {
              applicationId
              createdAt
              createdBy
              externalAnalyst
              familyName
              item
              givenName
              op
              record
              oldRecord
              recordId
              sessionSub
              tableName
            }
          }
          formData {
            jsonData
          }
          applicationAnnouncementsByApplicationId(first: 1000) {
            edges {
              node {
                announcementId
                announcementByAnnouncementId {
                  id
                  rowId
                  jsonData
                  ccbcNumbers
                }
              }
            }
          }
        }
      }
    `,
    query
  );

  const [filters, setFilters] = useState({ types: [], users: [] });

  const {
    applicationByRowId: {
      history,
      formData,
      applicationAnnouncementsByApplicationId,
    },
  } = queryFragment;
  const originalProjectTitle =
    formData?.jsonData?.projectInformation?.projectTitle;
  const originalOrganizationName =
    formData?.jsonData?.organizationProfile?.organizationName;

  const processedHistory = useMemo(() => {
    return processHistoryItems(history.nodes, {
      includeAttachments: false,
      applyUserFormatting: true,
    });
  }, [history.nodes]);

  const announcements = useMemo(() => {
    const announcementMap = new Map<string, any>();
    applicationAnnouncementsByApplicationId?.edges?.forEach((edge) => {
      const announcement = edge?.node?.announcementByAnnouncementId;
      if (announcement)
        announcementMap.set(String(announcement.rowId), announcement);
    });
    return announcementMap;
  }, [applicationAnnouncementsByApplicationId]);

  const filteredHistory = useMemo(() => {
    return processedHistory
      .map(({ historyItem }) => historyItem)
      .filter(
        (historyItem) =>
          filterByType(historyItem, filters) &&
          filterByUser(historyItem, filters)
      );
  }, [processedHistory, filters]);

  const typeOptions = useMemo(
    () => getTypeOptions(filteredHistory, filters),
    [filteredHistory, filters]
  );
  const userOptions = useMemo(
    () => getUserOptions(filteredHistory, filters),
    [filteredHistory, filters]
  );

  const chronologicalFilteredHistory = filteredHistory.slice().reverse();

  // use a memo here since we only need to find the record once,
  // unlikely that applicationHistory or originalName will change on re-render

  const recordWithTitleChange = useMemo(() => {
    return chronologicalFilteredHistory.find(
      (historyItem) =>
        historyItem.tableName === 'application_sow_data' &&
        historyItem.record?.json_data?.projectTitle !== originalProjectTitle &&
        historyItem.record?.json_data?.projectTitle != null &&
        historyItem.op !== 'UPDATE'
    )?.recordId;
  }, [chronologicalFilteredHistory, originalProjectTitle]);

  const recordWithOrgChange = useMemo(() => {
    return chronologicalFilteredHistory.find(
      (historyItem) =>
        historyItem.tableName === 'application_sow_data' &&
        historyItem.record?.json_data?.organizationName !==
          originalOrganizationName &&
        historyItem.record?.json_data?.organizationName != null &&
        historyItem.op !== 'UPDATE'
    )?.recordId;
  }, [chronologicalFilteredHistory, originalOrganizationName]);
  return (
    <>
      <HistoryFilter
        filterOptions={{ typeOptions, userOptions }}
        filters={filters}
        onFilterChange={(data: any) => {
          setFilters(data);
        }}
      />

      <StyledTable cellSpacing="0" cellPadding="0">
        <tbody>
          {processedHistory
            .filter(
              ({ historyItem }) =>
                filterByType(historyItem, filters) &&
                filterByUser(historyItem, filters)
            )
            .map(({ historyItem, prevHistoryItem }, index) => {
              const { recordId } = historyItem;
              // using index + recordId for key as just recordId was causing strange duplicate record bug for delete history item until page refresh
              return (
                <HistoryRow
                  // eslint-disable-next-line react/no-array-index-key
                  key={index + recordId}
                  historyItem={historyItem}
                  prevHistoryItem={prevHistoryItem}
                  originalProjectTitle={originalProjectTitle}
                  originalOrganizationName={originalOrganizationName}
                  recordWithOrgChange={recordWithOrgChange}
                  recordWithTitleChange={recordWithTitleChange}
                  announcements={announcements}
                />
              );
            })}
        </tbody>
      </StyledTable>
    </>
  );
};

export default HistoryTable;
