import { SectionCbcDataQuery } from '__generated__/SectionCbcDataQuery.graphql';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { usePreloadedQuery } from 'react-relay';
import { RelayProps, withRelay } from 'relay-nextjs';
import { graphql } from 'relay-runtime';
import review from 'formSchema/analyst/cbc/review';
import { ProjectTheme } from 'components/Analyst/Project';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import { useRef } from 'react';
import { useRouter } from 'next/router';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';

const getCbcSectionQuery = graphql`
  query SectionCbcDataQuery($rowId: Int!) {
    cbcDataByRowId(rowId: $rowId) {
      jsonData
      projectNumber
      rowId
    }
    session {
      sub
    }
    ...CbcAnalystLayout_query
  }
`;

const EditCbcSection = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, SectionCbcDataQuery>) => {
  const query = usePreloadedQuery(getCbcSectionQuery, preloadedQuery);
  const { cbcDataByRowId, session } = query;
  const router = useRouter();
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const section = router.query.section as string;
  const [updateFormData] = useUpdateCbcDataByRowIdMutation();

  const { jsonData } = cbcDataByRowId;

  const tombstone = {
    projectNumber: jsonData.projectNumber,
    originalProjectNumber: jsonData.originalProjectNumber,
    phase: jsonData.phase,
    intake: jsonData.intake,
    projectStatus: jsonData.projectStatus,
    changeRequestPending: jsonData.changeRequestPending,
    projectTitle: jsonData.projectTitle,
    projectDescription: jsonData.projectDescription,
    applicantContractualName: jsonData.applicantContractualName,
    currentOperatingName: jsonData.currentOperatingName,
    eightThirtyMillionFunding: jsonData.eightThirtyMillionFunding,
    federalFundingSource: jsonData.federalFundingSource,
    federalProjectNumber: jsonData.federalProjectNumber,
  };

  const projectType = {
    projectType: jsonData.projectType,
    transportProjectType: jsonData.transportProjectType,
    highwayProjectType: jsonData.highwayProjectType,
    lastMileProjectType: jsonData.lastMileProjectType,
    lastMileMinimumSpeed: jsonData.lastMileMinimumSpeed,
    connectedCoastNetworkDependant: jsonData.connectedCoastNetworkDependant,
  };
  const locationsAndCounts = {
    projectLocations: jsonData.projectLocations,
    communitiesAndLocalesCount: jsonData.communitiesAndLocalesCount,
    indigenousCommunities: jsonData.indigenousCommunities,
    householdCount: jsonData.householdCount,
    transportKm: jsonData.transportKm,
    highwayKm: jsonData.highwayKm,
    restAreas: jsonData.restAreas,
  };

  const funding = {
    bcFundingRequest: jsonData.bcFundingRequest,
    federalFunding: jsonData.federalFunding,
    applicantAmount: jsonData.applicantAmount,
    otherFunding: jsonData.otherFunding,
    totalProjectBudget: jsonData.totalProjectBudget,
  };

  const eventsAndDates = {
    nditConditionalApprovalLetterSent:
      jsonData.nditConditionalApprovalLetterSent,
    bindingAgreementSignedNditRecipient:
      jsonData.bindingAgreementSignedNditRecipient,
    announcedByProvince: jsonData.announcedByProvince,
    dateApplicationReceived: jsonData.dateApplicationReceived,
    dateConditionallyApproved: jsonData.dateConditionallyApproved,
    dateAgreementSigned: jsonData.dateAgreementSigned,
    proposedStartDate: jsonData.proposedStartDate,
    proposedCompletionDate: jsonData.proposedCompletionDate,
    reportingCompletionDate: jsonData.reportingCompletionDate,
    dateAnnounced: jsonData.dateAnnounced,
  };

  const miscellaneous = {
    projectMilestoneCompleted: jsonData.projectMilestoneCompleted,
    constructionCompletedOn: jsonData.constructionCompletedOn,
    milestoneComments: jsonData.milestoneComments,
    primaryNewsRelease: jsonData.primaryNewsRelease,
    secondaryNewsRelease: jsonData.secondaryNewsRelease,
    notes: jsonData.notes,
  };

  const projectDataReviews = {
    locked: jsonData.locked,
    lastReviewed: jsonData.lastReviewed,
    reviewNotes: jsonData.reviewNotes,
  };

  const handleSubmit = (e) => {
    hiddenSubmitRef.current?.click();
    e.preventDefault();
    updateFormData({
      variables: {
        input: {
          rowId: cbcDataByRowId.rowId,
          cbcDataPatch: {
            jsonData: {},
          },
        },
      },
      debounceKey: 'cbc_update_section_data',
    });
  };

  const dataBySection = {
    tombstone,
    projectType,
    locationsAndCounts,
    funding,
    eventsAndDates,
    miscellaneous,
    projectDataReviews,
  };

  return (
    <Layout title="Edit CBC Section" session={session}>
      <CbcAnalystLayout query={query}>
        <CbcForm
          formData={dataBySection[section]}
          hiddenSubmitRef={hiddenSubmitRef}
          isExpanded
          isFormEditMode
          title="CBC Form"
          schema={review.properties[section]}
          theme={ProjectTheme}
          uiSchema={editUiSchema[section]}
          resetFormData={() => {}}
          onSubmit={handleSubmit}
          saveBtnText="Save & Close"
        />
      </CbcAnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    console.log(ctx.query);
    return {
      rowId: parseInt(ctx.query.cbcId.toString(), 10),
      section: ctx.query.section,
    };
  },
};

export default withRelay(EditCbcSection, getCbcSectionQuery, withRelayOptions);

/* <Layout session={session} title="Connecting Communities BC">
      <CbcAnalystLayout query={query}>
        <RightAlignText>
          {!editMode && (
            <>
              <StyledButton
                onClick={() => {
                  setToggleExpandOrCollapseAll(true);
                }}
                type="button"
              >
                Expand all
              </StyledButton>
              {' | '}
              <StyledButton
                onClick={() => {
                  setToggleExpandOrCollapseAll(false);
                }}
                type="button"
              >
                Collapse all
              </StyledButton>
              {' | '}
            </>
          )}
          {allowEdit && (
            <StyledButton
              onClick={() => {
                setEditMode(!editMode);
              }}
              type="button"
            >
              {editMode ? 'Cancel quick edit' : 'Quick edit'}
            </StyledButton>
          )}
        </RightAlignText>
        <StyledCbcForm
          additionalContext={{ toggleOverride, isEditable: true, isCBC: true }}
          formData={formData}
          handleChange={(e) => {
            setFormData({ ...e.formData });
          }}
          hiddenSubmitRef={hiddenSubmitRef}
          isExpanded
          isFormAnimated={false}
          isFormEditMode={editMode}
          title="CBC Form"
          schema={review}
          theme={editMode ? ProjectTheme : ReviewTheme}
          uiSchema={editMode ? editUiSchema : reviewUiSchema}
          resetFormData={handleResetFormData}
          onSubmit={handleSubmit}
          setIsFormEditMode={setEditMode}
          saveBtnText="Save & Close"
        />
      </CbcAnalystLayout>
    </Layout> */
