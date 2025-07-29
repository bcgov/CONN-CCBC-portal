import { getFiscalQuarter, getFiscalYear } from 'utils/fiscalFormat';
import isEqual from 'lodash.isequal';

export const formatUserName = (historyItem: any) => {
  const isAnalyst =
    historyItem.sessionSub?.includes('idir') || historyItem.externalAnalyst;

  const fullName = isAnalyst
    ? `${historyItem.givenName} ${historyItem.familyName}`
    : 'The applicant';
  const isSystem = historyItem.createdBy === 1 && historyItem.op === 'INSERT';
  return {
    ...historyItem,
    user: isSystem ? 'The system' : fullName,
  };
};

export const processHistoryItems = (
  applicationHistory: readonly any[],
  options: {
    includeAttachments?: boolean;
    applyUserFormatting?: boolean;
    onSkipItem?: (historyItem: any, reason: string) => void;
  } = {}
) => {
  const {
    includeAttachments = false,
    applyUserFormatting = false,
    onSkipItem,
  } = options;

  // Sort history items
  const sortedHistory = [...applicationHistory].sort((a, b) => {
    const aDeleted = a.op === 'UPDATE';
    const bDeleted = b.op === 'UPDATE';
    const aDate = aDeleted ? a.record.updated_at : a.createdAt;
    const bDate = bDeleted ? b.record.updated_at : b.createdAt;
    return new Date(aDate).getTime() - new Date(bDate).getTime();
  });

  // Find received index
  const receivedIndex = sortedHistory
    .map((historyItem) => historyItem.item)
    .indexOf('received');

  // Get history from received onwards, reversed
  const historyList = sortedHistory
    .slice(receivedIndex >= 0 ? receivedIndex : 0)
    .reverse()
    .map(applyUserFormatting ? formatUserName : (item) => item);

  // Process each history item with previous item matching logic
  const processedHistory = historyList
    .map((historyItem, index, array) => {
      // Skip attachments if not included
      if (!includeAttachments && historyItem.tableName === 'attachment') {
        onSkipItem?.(historyItem, 'attachment');
        return null;
      }

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
              previousItem.record?.rfi_number ===
                historyItem.record?.rfi_number &&
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
              historyItem.record?.json_data?.dueDate &&
              getFiscalQuarter(historyItem.record.json_data.dueDate);
            const year =
              historyItem.record?.json_data?.dueDate &&
              getFiscalYear(historyItem.record.json_data.dueDate);
            const updated =
              previousItem.op === 'INSERT' &&
              getFiscalQuarter(previousItem.record?.json_data?.dueDate) ===
                quarter &&
              getFiscalYear(previousItem.record?.json_data?.dueDate) === year;
            return updated;
          }
          // application milestone needs to match by quarter
          if (
            previousItem.tableName === 'application_milestone_data' &&
            previousItem.tableName === historyItem.tableName
          ) {
            const quarter =
              historyItem.record?.json_data?.dueDate &&
              getFiscalQuarter(historyItem.record.json_data.dueDate);
            const year =
              historyItem.record?.json_data?.dueDate &&
              getFiscalYear(historyItem.record.json_data.dueDate);
            const updated =
              previousItem.op === 'INSERT' &&
              getFiscalQuarter(previousItem.record?.json_data?.dueDate) ===
                quarter &&
              getFiscalYear(previousItem.record?.json_data?.dueDate) === year;
            return updated;
          }
          // change request data must match by amendment number
          if (previousItem.tableName === 'change_request_data') {
            return (
              previousItem.tableName === historyItem.tableName &&
              previousItem.record?.json_data?.amendmentNumber ===
                historyItem.record?.json_data?.amendmentNumber
            );
          }
          return previousItem.tableName === historyItem.tableName;
        });
      }

      const prevHistoryItem = prevItems.length > 0 ? prevItems[0] : {};

      // Skip duplicate history items for communities
      if (
        historyItem?.tableName === 'application_communities' &&
        isEqual(
          prevHistoryItem.record?.application_rd,
          historyItem.record?.application_rd
        )
      ) {
        onSkipItem?.(historyItem, 'duplicate_community');
        return null;
      }

      return {
        historyItem,
        prevHistoryItem,
      };
    })
    .filter(Boolean); // Remove null entries

  return processedHistory;
};
