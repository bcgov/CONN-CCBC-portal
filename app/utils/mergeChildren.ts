const getMergeRecordId = (item: any) =>
  item?.recordId ?? item?.rowId ?? item?.record?.id ?? item?.oldRecord?.id;

export const getMergeTimestamp = (item: any) => {
  if (item?.op === 'UPDATE') {
    return item?.record?.updated_at || item?.createdAt || item?.ts;
  }
  return item?.createdAt || item?.ts;
};

export const getMergeChildrenKey = (item: any, parentId?: number | string) =>
  `${getMergeRecordId(item)}-${getMergeTimestamp(item)}-${
    parentId ?? 'unknown'
  }`;

export const buildMergeChildrenMap = (items: any[]) => {
  const childrenByRecordId = new Map();
  const currentChildrenByParent = new Map();
  const processedEvents = new Set();

  const sortedMergeItems = (items || [])
    .filter((item) => item.tableName === 'application_merge')
    .sort((a, b) => {
      const aDate = new Date(getMergeTimestamp(a) || 0).getTime();
      const bDate = new Date(getMergeTimestamp(b) || 0).getTime();
      return aDate - bDate;
    });

  sortedMergeItems.forEach((historyItem) => {
    const eventKey = `${getMergeRecordId(historyItem)}-${getMergeTimestamp(
      historyItem
    )}`;
    if (processedEvents.has(eventKey)) {
      return;
    }
    processedEvents.add(eventKey);

    const recordParentId = Number(
      historyItem.record?.parent_application_id ??
        historyItem.record?.parent_cbc_id
    );
    const oldParentId = Number(
      historyItem.oldRecord?.parent_application_id ??
        historyItem.oldRecord?.parent_cbc_id
    );
    const hasRecordParent = !Number.isNaN(recordParentId);
    const hasOldParent = !Number.isNaN(oldParentId);
    const childNumber =
      historyItem.record?.child_ccbc_number ||
      historyItem.oldRecord?.child_ccbc_number ||
      historyItem.record?.child_cbc_project_number ||
      historyItem.oldRecord?.child_cbc_project_number;
    const isRemoval = !!historyItem.record?.archived_at;
    const parentChanged =
      hasRecordParent && hasOldParent && recordParentId !== oldParentId;

    const updateChildrenForParent = (parentId: number, action: string) => {
      const currentChildren: Set<string> =
        currentChildrenByParent.get(parentId) ?? new Set<string>();
      const before = Array.from(currentChildren).sort((a, b) =>
        a.localeCompare(b)
      );

      if (childNumber) {
        if (action === 'remove') {
          currentChildren.delete(childNumber);
        } else if (action === 'add') {
          currentChildren.add(childNumber);
        }
      }

      const after = Array.from(currentChildren).sort((a, b) =>
        a.localeCompare(b)
      );
      currentChildrenByParent.set(parentId, currentChildren);
      childrenByRecordId.set(getMergeChildrenKey(historyItem, parentId), {
        before,
        after,
      });
    };

    if (parentChanged) {
      if (hasOldParent) {
        updateChildrenForParent(oldParentId, 'remove');
      }
      if (hasRecordParent) {
        updateChildrenForParent(recordParentId, 'add');
      }
      return;
    }

    if (hasRecordParent) {
      updateChildrenForParent(recordParentId, isRemoval ? 'remove' : 'add');
    }
  });

  return childrenByRecordId;
};
