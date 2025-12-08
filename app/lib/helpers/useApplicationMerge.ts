import { RJSFSchema } from '@rjsf/utils';
import miscellaneous from 'formSchema/analyst/summary/miscellaneous';
import reviewUiSchema from 'formSchema/uiSchema/summary/reviewUiSchema';
import {
  APPROVED_STATUSES,
  MERGED_STATUSES,
} from './ccbcSummaryGenerateFormData';

const useApplicationMerge = () => {
  const getMiscLinkedProjectLabel = (status?: string) => {
    if (APPROVED_STATUSES.includes(status)) {
      return 'Child Project(s)';
    }
    if (MERGED_STATUSES.includes(status)) {
      return 'Parent Project';
    }
    return 'Parent/Child Project(s)';
  };

  const getMiscellaneousSchema = (applicationByRowId, isEditView = false) => {
    const isMergedStatus = MERGED_STATUSES.includes(applicationByRowId?.status);
    const isApprovedStatus = APPROVED_STATUSES.includes(
      applicationByRowId?.status
    );
    const miscLinkedProjectLabel = getMiscLinkedProjectLabel(
      applicationByRowId?.status
    );

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

  return { getMiscellaneousSchema, getMiscLinkedProjectLabel };
};

export default useApplicationMerge;
