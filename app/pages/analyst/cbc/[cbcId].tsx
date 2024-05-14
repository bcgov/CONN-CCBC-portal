import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { CbcIdQuery } from '__generated__/CbcIdQuery.graphql';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import styled from 'styled-components';
import ReviewTheme from 'components/Review/ReviewTheme';
// import cbcTombstone from 'formSchema/analyst/cbc/tombstone';
// import tombstoneUiSchema from 'formSchema/uiSchema/cbc/tombstoneUiSchema';
// import projectType from 'formSchema/analyst/cbc/projectType';
// import projectTypeUiSchema from 'formSchema/uiSchema/cbc/projectTypeUiSchema';
// import locationsAndCounts from 'formSchema/analyst/cbc/locationsAndCounts';
// import locationsAndCountsUiSchema from 'formSchema/uiSchema/cbc/locationsAndCountsUiSchema';
// import funding from 'formSchema/analyst/cbc/funding';
// import fundingUiSchema from 'formSchema/uiSchema/cbc/fundingUiSchema';
// import eventsAndDates from 'formSchema/analyst/cbc/eventsAndDates';
// import eventsAndDatesUiSchema from 'formSchema/uiSchema/cbc/eventsAndDatesUiSchema';
// import miscellaneous from 'formSchema/analyst/cbc/miscellaneous';
// import miscellaneousUiSchema from 'formSchema/uiSchema/cbc/miscellaneousUiSchema';
// import projectDataReviews from 'formSchema/analyst/cbc/projectDataReviews';
// import projectDataReviewsUiSchema from 'formSchema/uiSchema/cbc/projectDataReviewsUiSchema';
import { useRef, useState } from 'react';
import { ProjectTheme } from 'components/Analyst/Project';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import review from 'formSchema/analyst/cbc/review';
import reviewUiSchema from 'formSchema/uiSchema/cbc/reviewUiSchema';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';

const getCbcQuery = graphql`
  query CbcIdQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId {
        edges {
          node {
            jsonData
            sharepointTimestamp
            rowId
            projectNumber
            updatedAt
            updatedBy
          }
        }
      }
    }
    session {
      sub
    }
    ...CbcAnalystLayout_query
  }
`;

const StyledCbcForm = styled(CbcForm)`
  margin-bottom: 0px;
`;

const StyledButton = styled('button')`
  color: ${(props) => props.theme.color.links};
`;

const RightAlignText = styled('div')`
  padding-top: 20px;
  text-align: right;
  padding-bottom: 4px;
`;

const Cbc = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, CbcIdQuery>) => {
  const query = usePreloadedQuery(getCbcQuery, preloadedQuery);

  const [toggleOverride, setToggleExpandOrCollapseAll] = useState<
    boolean | undefined
  >(undefined);

  const [editMode, setEditMode] = useState(false);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const { cbcByRowId, session } = query;
  const { cbcDataByCbcId } = cbcByRowId;
  const { edges } = cbcDataByCbcId;
  const cbcData = edges[0].node;
  const { jsonData } = cbcData;

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

  const [formData, setFormData] = useState({
    tombstone,
    projectType,
    locationsAndCounts,
    funding,
    eventsAndDates,
    miscellaneous,
    projectDataReviews,
  });
  const [updateFormData] = useUpdateCbcDataByRowIdMutation();

  const handleSubmit = (e) => {
    hiddenSubmitRef.current.click();
    e.preventDefault();
    updateFormData({
      variables: {
        input: {
          rowId: cbcData.rowId,
          cbcDataPatch: {
            jsonData: {
              ...formData.tombstone,
              ...formData.projectType,
              ...formData.locationsAndCounts,
              ...formData.funding,
              ...formData.eventsAndDates,
              ...formData.miscellaneous,
              ...formData.projectDataReviews,
            },
          },
        },
      },
      debounceKey: 'cbc_update_form_data',
      onCompleted: () => {
        setEditMode(false);
      },
    });
  };

  const handleResetFormData = () => {
    setEditMode(false);
    setFormData({} as any);
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
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
          <StyledButton
            onClick={() => {
              setEditMode(!editMode);
            }}
            type="button"
          >
            {editMode ? 'Cancel quick edit' : 'Quick edit'}
          </StyledButton>
        </RightAlignText>
        <StyledCbcForm
          additionalContext={{ toggleOverride }}
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
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.cbcId.toString(), 10),
    };
  },
};

export default withRelay(Cbc, getCbcQuery, withRelayOptions);
