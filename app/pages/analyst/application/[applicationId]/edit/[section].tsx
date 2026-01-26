import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { IChangeEvent } from '@rjsf/core';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Button from '@button-inc/bcgov-theme/Button';
import budgetDetails from 'formSchema/pages/budgetDetails';
import FormBase from 'components/Form/FormBase';
import {
  calculate,
  mergeFormSectionData,
} from 'components/Form/ApplicationForm';
import Layout from 'components/Layout';
import { uiSchema } from 'formSchema';
import { AnalystLayout, ChangeModal } from 'components/Analyst';
import { SectionQuery } from '__generated__/SectionQuery.graphql';
import { useCreateNewFormDataMutation } from 'schema/mutations/application/createNewFormData';
import { analystProjectArea, benefits } from 'formSchema/uiSchema/pages';
import useModal from 'lib/helpers/useModal';
import useEmailNotification from 'lib/helpers/useEmailNotification';
import review from 'formSchema/analyst/summary/review';
import reviewUiSchema from 'formSchema/uiSchema/summary/reviewUiSchema';
import {
  getFundingData,
  getMiscellaneousData,
  getInternalNotesData,
} from 'lib/helpers/ccbcSummaryGenerateFormData';
import { useSaveFnhaContributionMutation } from 'schema/mutations/application/saveFnhaContributionMutation';
import { RJSFSchema } from '@rjsf/utils';
import useApplicationMerge from 'lib/helpers/useApplicationMerge';
import { useToast } from 'components/AppProvider';
import { useCreateApplicationInternalNoteMutation } from 'schema/mutations/application/createApplicationInternalNote';
import { useUpdateApplicationInternalNoteMutation } from 'schema/mutations/application/updateApplicationInternalNote';

const getSectionQuery = graphql`
  query SectionQuery($rowId: Int!) {
    applicationByRowId(rowId: $rowId) {
      rowId
      ccbcNumber
      status
      formData {
        formSchemaId
        jsonData
        formByFormSchemaId {
          jsonSchema
        }
      }
      parentApplicationMerge: applicationMergesByChildApplicationId(
        first: 1
        filter: { archivedAt: { isNull: true } }
        orderBy: CREATED_AT_DESC
      ) {
        __id
        edges {
          node {
            parentCbcId
            parentApplicationId
            applicationByParentApplicationId {
              ccbcNumber
              rowId
            }
            cbcByParentCbcId {
              projectNumber
            }
          }
        }
      }
      childApplicationMerge: applicationMergesByParentApplicationId(
        filter: { archivedAt: { isNull: true } }
        orderBy: CREATED_AT_DESC
      ) {
        edges {
          node {
            childApplicationId
            applicationByChildApplicationId {
              ccbcNumber
              rowId
            }
          }
        }
      }
      conditionalApproval {
        jsonData
      }
      applicationFnhaContributionsByApplicationId {
        __id
        edges {
          node {
            id
            fnhaContribution
          }
        }
      }
      applicationInternalNotesByApplicationId(
        condition: { archivedAt: null }
        first: 1
      ) {
        edges {
          node {
            id
            rowId
            note
          }
        }
      }
    }
    allApplicationSowData(
      filter: { applicationId: { equalTo: $rowId } }
      orderBy: AMENDMENT_NUMBER_DESC
      condition: { archivedAt: null }
    ) {
      nodes {
        rowId
        sowTab7SBySowId {
          nodes {
            jsonData
            rowId
            sowId
          }
        }
      }
    }
    allApplications(
      filter: { archivedAt: { isNull: true } }
      orderBy: CCBC_NUMBER_ASC
    ) {
      nodes {
        rowId
        ccbcNumber
      }
    }
    allCbcData(
      filter: { archivedAt: { isNull: true } }
      orderBy: PROJECT_NUMBER_ASC
    ) {
      nodes {
        rowId
        projectNumber
        cbcId
      }
    }
    session {
      sub
      authRole
    }
    ...AnalystLayout_query
  }
`;

const EditApplication = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, SectionQuery>) => {
  const query = usePreloadedQuery(getSectionQuery, preloadedQuery);
  const {
    session,
    applicationByRowId: {
      rowId,
      ccbcNumber,
      applicationFnhaContributionsByApplicationId,
      formData: {
        formByFormSchemaId: { jsonSchema },
        formSchemaId,
        jsonData,
      },
      parentApplicationMerge,
    },
    allApplicationSowData,
    allApplications,
    allCbcData,
  } = query;

  // Use a hidden ref for submit button instead of passing to modal so we have the most up to date form data
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { showToast } = useToast();
  const { getMiscellaneousSchema, updateParent } = useApplicationMerge();
  const sectionName = router.query.section as string;
  const applicationId = router.query.applicationId as string;
  const ccbcApplications =
    allApplications?.nodes?.filter(
      ({ rowId: applicationRowId }) =>
        applicationRowId !== Number(applicationId)
    ) || [];
  const cbcApplications = allCbcData?.nodes || [];
  const applicationsList = [...ccbcApplications, ...cbcApplications];

  // Budget details was removed from the applicant schema but we want to display in for Analysts
  // no matter which schema is returned from the database
  const formSchema = {
    ...jsonSchema,
    properties: {
      ...jsonSchema.properties,
      ...budgetDetails,
    },
  };
  const isSummaryEdit =
    sectionName === 'funding' || sectionName === 'miscellaneous';
  const shouldRequireChangeReason = sectionName !== 'miscellaneous';

  // custom schema for miscellaneous edit with project options
  const { schema: miscSchema, uiSchema: miscUiSchema } = getMiscellaneousSchema(
    query?.applicationByRowId,
    true,
    session?.authRole
  );
  const miscellaneousOptions = applicationsList.map((application: any) => {
    return {
      rowId: application.cbcId ?? application.rowId,
      ccbcNumber: application.projectNumber ?? application.ccbcNumber,
      type: application.cbcId ? 'CBC' : 'CCBC',
    };
  });

  const sectionUiSchema =
    sectionName === 'miscellaneous'
      ? miscUiSchema
      : reviewUiSchema[sectionName];
  let sectionSchema: RJSFSchema;
  if (isSummaryEdit) {
    sectionSchema =
      sectionName === 'miscellaneous'
        ? (miscSchema as RJSFSchema)
        : (review.properties[sectionName] as RJSFSchema);
  } else {
    sectionSchema = formSchema.properties[sectionName] as RJSFSchema;
  }

  uiSchema.benefits = { ...uiSchema.benefits, ...benefits } as any;
  uiSchema.projectArea = {
    ...uiSchema.projectArea,
    ...analystProjectArea,
  } as any;
  // https://github.com/rjsf-team/react-jsonschema-form/issues/1023
  // Save and update form data in state due to RJSF setState bug
  const fundingSummaryData = getFundingData(
    query.applicationByRowId,
    allApplicationSowData
  );

  const miscellaneousData = getMiscellaneousData(query?.applicationByRowId);
  const internalNotesData = getInternalNotesData(query?.applicationByRowId);
  const summaryData =
    sectionName === 'miscellaneous'
      ? {
          linkedProject: miscellaneousData?.length ? miscellaneousData : [],
          internalNotes: internalNotesData,
        }
      : fundingSummaryData;
  const [sectionFormData, setSectionFormData] = useState(
    isSummaryEdit ? summaryData : jsonData[sectionName]
  );
  const [changeReason, setChangeReason] = useState('');
  const [isFormSaved, setIsFormSaved] = useState(true);
  const changeModal = useModal();
  const { notifyHHCountUpdate } = useEmailNotification();
  const [saveFnhaContributionMutation] = useSaveFnhaContributionMutation();
  const [createInternalNote] = useCreateApplicationInternalNoteMutation();
  const [updateInternalNote] = useUpdateApplicationInternalNoteMutation();
  const handleChange = (e: IChangeEvent) => {
    setIsFormSaved(false);
    const newFormSectionData = { ...e.formData };

    const calculatedSectionData = calculate(newFormSectionData, sectionName);
    setSectionFormData(calculatedSectionData);
  };

  const [createNewFormData] = useCreateNewFormDataMutation();

  const handleFundingUpdate = () => {
    saveFnhaContributionMutation({
      variables: {
        connections: [applicationFnhaContributionsByApplicationId.__id],
        input: {
          _applicationId: Number(applicationId),
          _fnhaContribution: sectionFormData?.fnhaContribution || 0,
          _reasonForChange: changeReason,
        },
      },
      onCompleted: () => {
        router.push(`/analyst/application/${applicationId}/summary`);
      },
    });
  };

  const handleMiscellaneousEdit = () => {
    const oldParent = miscellaneousData?.[0]?.rowId;
    const newParent = sectionFormData?.linkedProject;
    const connections = parentApplicationMerge?.__id
      ? [parentApplicationMerge.__id]
      : [];

    function handleParentUpdate() {
      updateParent(
        oldParent,
        newParent,
        rowId,
        changeReason,
        connections,
        // onSuccess
        () => {
          router.push(`/analyst/application/${applicationId}/summary`);
        },
        // onError show error message
        () => {
          showToast?.('An error occurred. Please try again.', 'error', 15000);
          router.push(`/analyst/application/${applicationId}/summary`);
        }
      );
    }

    // Handle internal notes update/create
    const currentInternalNote = (query?.applicationByRowId as any)
      ?.applicationInternalNotesByApplicationId?.edges?.[0]?.node;
    const newInternalNotesValue = sectionFormData?.internalNotes || null;
    const currentInternalNotesValue = currentInternalNote?.note || null;
    const needsInternalNotesUpdate =
      newInternalNotesValue !== currentInternalNotesValue;

    // If internal notes need to be updated, handle that first
    if (needsInternalNotesUpdate) {
      if (!currentInternalNote && newInternalNotesValue) {
        // Create new internal note
        createInternalNote({
          variables: {
            input: {
              applicationInternalNote: {
                applicationId: rowId,
                note: newInternalNotesValue,
                changeReason,
              },
            },
          },
          onCompleted: () => {
            // After creating note, handle parent update
            handleParentUpdate();
          },
          onError: () => {
            showToast?.(
              'An error occurred while updating internal notes. Please try again.',
              'error',
              15000
            );
          },
        });
        return;
      }
      if (currentInternalNote?.id) {
        // Update existing internal note
        updateInternalNote({
          variables: {
            input: {
              id: currentInternalNote.id,
              applicationInternalNotePatch: {
                note: newInternalNotesValue || '',
                changeReason,
              },
            },
          },
          onCompleted: () => {
            // After updating note, handle parent update
            handleParentUpdate();
          },
          onError: () => {
            showToast?.(
              'An error occurred while updating internal notes. Please try again.',
              'error',
              15000
            );
          },
        });
        return;
      }
    }

    // If no internal notes update needed, just handle parent update
    handleParentUpdate();
  };

  const handleSummaryEdit = () => {
    switch (sectionName) {
      case 'miscellaneous':
        handleMiscellaneousEdit();
        break;
      case 'funding':
        handleFundingUpdate();
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const calculatedSectionData = calculate(sectionFormData, sectionName);

    const newFormData = mergeFormSectionData(
      jsonData,
      sectionName,
      calculatedSectionData,
      formSchema
    );

    const isOtherFundingSourcesPage = sectionName === 'otherFundingSources';
    // remove field otherFundingSources array when otherFundingSources is false as it leaves misleading data
    if (
      isOtherFundingSourcesPage &&
      !newFormData.otherFundingSources.otherFundingSources
    ) {
      delete newFormData.otherFundingSources.otherFundingSourcesArray;
    }

    createNewFormData({
      variables: {
        input: {
          applicationRowId: Number(applicationId),
          jsonData: newFormData,
          reasonForChange: changeReason,
          formSchemaId,
        },
      },
      onCompleted: () => {
        // Notifying the user that the HH count has been updated
        if (sectionName === 'benefits') {
          notifyHHCountUpdate(
            calculatedSectionData,
            jsonData.benefits,
            applicationId,
            {
              ccbcNumber,
              timestamp: new Date().toLocaleString(),
              reasonProvided: changeReason || 'No reason provided',
              manualUpdate: true,
            }
          );
        }
        router.push(`/analyst/application/${applicationId}`);
      },
    });
  };

  const triggerModal = () => {
    changeModal.open();
  };

  const handleSave = () => {
    if (shouldRequireChangeReason) {
      triggerModal();
      return;
    }
    handleSummaryEdit();
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        {!isSummaryEdit && (
          <>
            <h2>Application</h2>
            <hr />
            <h3>{sectionSchema.title}</h3>
          </>
        )}

        <FormBase
          formData={sectionFormData}
          onChange={handleChange}
          schema={sectionSchema}
          uiSchema={isSummaryEdit ? sectionUiSchema : uiSchema[sectionName]}
          onSubmit={handleSave}
          formContext={{
            ccbcIdList: miscellaneousOptions,
          }}
          noValidate
        >
          <button
            ref={hiddenSubmitRef}
            type="submit"
            style={{ display: 'none' }}
            data-testid="hidden-submit"
            aria-label="hidden-submit"
          />
          <Button
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              if (!isFormSaved) {
                handleSave();
              }
            }}
          >
            {isFormSaved ? 'Saved' : 'Save'}
          </Button>
          <Button
            variant="secondary"
            style={{ marginLeft: '24px' }}
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              router.push(
                isSummaryEdit
                  ? `/analyst/application/${applicationId}/summary`
                  : `/analyst/application/${applicationId}`
              );
            }}
          >
            Cancel
          </Button>
        </FormBase>

        <ChangeModal
          id="change-modal"
          title="Reason for change (Optional)"
          onCancel={changeModal.close}
          onSave={isSummaryEdit ? handleSummaryEdit : handleSubmit}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setChangeReason(e.target.value)
          }
          value={changeReason}
          {...changeModal}
        />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(EditApplication, getSectionQuery, withRelayOptions);
