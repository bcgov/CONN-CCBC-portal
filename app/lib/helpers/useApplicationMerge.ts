import { useCallback } from 'react';
import { RJSFSchema } from '@rjsf/utils';
import miscellaneous from 'formSchema/analyst/summary/miscellaneous';
import reviewUiSchema from 'formSchema/uiSchema/summary/reviewUiSchema';
import { useArchiveApplicationMergeMutation } from 'schema/mutations/application/archiveApplicationMerge';
import { useMergeApplicationMutation } from 'schema/mutations/application/mergeApplication';
import {
  APPROVED_STATUSES,
  MERGED_STATUSES,
} from './ccbcSummaryGenerateFormData';

type LinkedProjectSelection = {
  rowId: number;
  type: 'CCBC' | 'CBC';
};

const useApplicationMerge = () => {
  const [mergeApplication] = useMergeApplicationMutation();
  const [archiveApplicationMerge] = useArchiveApplicationMergeMutation();

  const getMiscLinkedProjectLabel = (status?: string) => {
    if (APPROVED_STATUSES.includes(status)) {
      return 'Child Project(s)';
    }
    if (MERGED_STATUSES.includes(status)) {
      return 'Parent Project';
    }
    return 'Parent/Child Project(s)';
  };

  const getMiscellaneousSchema = (
    applicationByRowId,
    isEditView = false,
    authRole?: string
  ) => {
    const isMergedStatus = MERGED_STATUSES.includes(applicationByRowId?.status);
    const isApprovedStatus = APPROVED_STATUSES.includes(
      applicationByRowId?.status
    );
    const miscLinkedProjectLabel = getMiscLinkedProjectLabel(
      applicationByRowId?.status
    );

    // Check if user has permission to update internal notes
    const canEditInternalNotes =
      authRole === 'super_admin' || authRole === 'ccbc_admin';

    const miscellaneousUiSchema = {
      ...reviewUiSchema.miscellaneous,
      linkedProject:
        isMergedStatus && isEditView
          ? {
              'ui:widget': 'CcbcIdWidget',
              'ui:placeholder': 'Search by ID',
              'ui:options': {
                allowMultiple: false,
                boldTitle: true,
                widgetWidth: '50%',
              },
            }
          : {
              'ui:widget': 'LinkArrayWidget',
              // parent edititng hint
              'ui:help':
                isEditView && isApprovedStatus
                  ? '(To update child applications, go to the Summary page of each child record and edit the Parent Project field under the Miscellaneous accordion.)'
                  : null,
              'ui:options': {
                boldTitle: true,
              },
            },
      internalNotes: {
        'ui:widget': 'TextAreaWidget',
        'ui:label': 'Internal Notes',
        'ui:disabled': !canEditInternalNotes,
        'ui:help': !canEditInternalNotes
          ? '(This field is managed by CCBC Admin.)'
          : null,
        'ui:options': {
          rows: 5,
          boldTitle: true,
          hideOptional: true,
        },
      },
    };

    const miscellaneousSchema: RJSFSchema = {
      ...miscellaneous,
      properties: {
        ...miscellaneous.properties,
        linkedProject: {
          ...(miscellaneous.properties.linkedProject as any),
          title: isEditView
            ? `${miscLinkedProjectLabel}: `
            : miscLinkedProjectLabel,
        },
      },
    };

    return {
      schema: miscellaneousSchema,
      uiSchema: miscellaneousUiSchema,
    };
  };

  const updateParent = useCallback(
    (
      oldParent: number | undefined,
      newParent: LinkedProjectSelection | null | undefined,
      rowId: number,
      changeReason: string,
      connections: readonly string[],
      onCompleted: () => void,
      onError?: (error?: unknown) => void
    ) => {
      const mergeConnection = connections ?? [];

      // No change
      if (newParent?.rowId === oldParent) {
        onCompleted();
        return;
      }

      // Remove an existing parent relationship
      if (oldParent && !newParent?.rowId) {
        archiveApplicationMerge({
          variables: {
            input: {
              _childApplicationId: rowId,
              _changeReason: changeReason,
            },
          },
          onError,
          onCompleted,
        });
        return;
      }

      // Add or replace the parent relationship
      if (!newParent?.rowId) return;

      const mergeInput =
        newParent.type === 'CCBC'
          ? { _parentApplicationId: newParent.rowId, _parentCbcId: null }
          : { _parentApplicationId: null, _parentCbcId: newParent.rowId };

      mergeApplication({
        variables: {
          input: {
            _childApplicationId: rowId,
            _changeReason: changeReason,
            ...mergeInput,
          },
          connections: mergeConnection,
        },
        onError,
        onCompleted,
      });
    },
    [archiveApplicationMerge, mergeApplication]
  );

  return { getMiscellaneousSchema, getMiscLinkedProjectLabel, updateParent };
};

export default useApplicationMerge;
