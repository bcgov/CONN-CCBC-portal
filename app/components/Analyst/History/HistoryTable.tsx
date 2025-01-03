import styled from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import { HistoryTable_query$key } from '__generated__/HistoryTable_query.graphql';
import { useMemo, useState } from 'react';
import isEqual from 'lodash.isequal';
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
        }
      }
    `,
    query
  );

  const [filters, setFilters] = useState({ types: [], users: [] });

  const {
    applicationByRowId: { history, formData },
  } = queryFragment;
  const originalProjectTitle =
    formData?.jsonData?.projectInformation?.projectTitle;
  const originalOrganizationName =
    formData?.jsonData?.organizationProfile?.organizationName;

  const applicationHistory = useMemo(() => {
    return [...history.nodes]?.sort((a, b) => {
      // sort by updated at if the record was delete
      const aDeleted = a.op === 'UPDATE';
      const bDeleted = b.op === 'UPDATE';
      const aDate = aDeleted ? a.record.updated_at : a.createdAt;
      const bDate = bDeleted ? b.record.updated_at : b.createdAt;
      return new Date(aDate).getTime() - new Date(bDate).getTime();
    });
  }, [history.nodes]);

  const receivedIndex = useMemo(
    () =>
      applicationHistory
        .map((historyItem) => historyItem.item)
        .indexOf('received'),
    [applicationHistory]
  );

  const formatUserName = (historyItem: any) => {
    const isAnalyst =
      historyItem.sessionSub.includes('idir') || historyItem.externalAnalyst;

    const fullName = isAnalyst
      ? `${historyItem.givenName} ${historyItem.familyName}`
      : 'The applicant';
    const isSystem = historyItem.createdBy === 1 && historyItem.op === 'INSERT';
    return {
      ...historyItem,
      user: isSystem ? 'The system' : fullName,
    };
  };

  const historyList = useMemo(() => {
    return applicationHistory
      .slice(receivedIndex)
      .reverse()
      .map(formatUserName);
  }, [applicationHistory, receivedIndex]);

  const typeOptions = useMemo(
    () => getTypeOptions(historyList, filters),
    [historyList, filters]
  );
  const userOptions = useMemo(
    () => getUserOptions(historyList, filters),
    [historyList, filters]
  );

  const filteredHistory = useMemo(
    () =>
      historyList.filter(
        (historyItem) =>
          filterByType(historyItem, filters) &&
          filterByUser(historyItem, filters)
      ),
    [historyList, filters]
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
          {filteredHistory?.map((historyItem, index, array) => {
            const { recordId } = historyItem;
            const a = array.slice(index + 1);
            let prevItems;
            if (historyItem.op === 'UPDATE') {
              prevItems = [{ record: historyItem.oldRecord }];
            } else {
              prevItems = a.filter((previousItem) => {
                // assessment data must match by item type
                if (previousItem.tableName === 'assessment_data') {
                  return (
                    previousItem.tableName === historyItem.tableName &&
                    previousItem.item === historyItem.item
                  );
                }
                // rfis must match by rfi_number
                if (previousItem.tableName === 'rfi_data') {
                  return (
                    previousItem.tableName === historyItem.tableName &&
                    previousItem.record.rfi_number ===
                      historyItem.record.rfi_number &&
                    previousItem.op === 'INSERT'
                  );
                }
                // community reports must match by quarter
                if (
                  previousItem.tableName ===
                    'application_community_progress_report_data' &&
                  previousItem.tableName === historyItem.tableName
                ) {
                  const quarter =
                    historyItem.record.json_data.dueDate &&
                    getFiscalQuarter(historyItem.record.json_data.dueDate);
                  const year =
                    historyItem.record.json_data.dueDate &&
                    getFiscalYear(historyItem.record.json_data.dueDate);
                  const updated =
                    previousItem.op === 'INSERT' &&
                    getFiscalQuarter(previousItem.record.json_data.dueDate) ===
                      quarter &&
                    getFiscalYear(previousItem.record.json_data.dueDate) ===
                      year;
                  return updated;
                }
                // application milestone needs to match by quarter
                if (
                  previousItem.tableName === 'application_milestone_data' &&
                  previousItem.tableName === historyItem.tableName
                ) {
                  const quarter =
                    historyItem.record.json_data.dueDate &&
                    getFiscalQuarter(historyItem.record.json_data.dueDate);
                  const year =
                    historyItem.record.json_data.dueDate &&
                    getFiscalYear(historyItem.record.json_data.dueDate);
                  const updated =
                    previousItem.op === 'INSERT' &&
                    getFiscalQuarter(previousItem.record.json_data.dueDate) ===
                      quarter &&
                    getFiscalYear(previousItem.record.json_data.dueDate) ===
                      year;
                  return updated;
                }
                return previousItem.tableName === historyItem.tableName;
              });
            }

            const prevHistoryItem = prevItems.length > 0 ? prevItems[0] : {};
            // Skipping duplicate history items for communities
            if (
              historyItem?.tableName === 'application_communities' &&
              isEqual(
                prevHistoryItem.record?.application_rd,
                historyItem.record?.application_rd
              )
            ) {
              return null;
            }
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
              />
            );
          })}
        </tbody>
      </StyledTable>
    </>
  );
};

export default HistoryTable;
