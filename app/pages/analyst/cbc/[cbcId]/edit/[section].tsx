import { SectionCbcDataQuery } from '__generated__/SectionCbcDataQuery.graphql';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { usePreloadedQuery } from 'react-relay';
import { RelayProps, withRelay } from 'relay-nextjs';
import { graphql } from 'relay-runtime';
import review from 'formSchema/analyst/cbc/review';
import { ProjectTheme } from 'components/Analyst/Project';
import { useState } from 'react';
import { useRouter } from 'next/router';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { FormBase } from 'components/Form';
import { Button } from '@button-inc/bcgov-theme';
import { RJSFSchema } from '@rjsf/utils';
import useModal from 'lib/helpers/useModal';
import { ChangeModal } from 'components/Analyst';
import { useUpdateCbcDataAndInsertChangeRequest } from 'schema/mutations/cbc/updateCbcDataAndInsertChangeReason';

const getCbcSectionQuery = graphql`
  query SectionCbcDataQuery($rowId: Int!) {
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

const EditCbcSection = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, SectionCbcDataQuery>) => {
  const query = usePreloadedQuery(getCbcSectionQuery, preloadedQuery);
  const { session, cbcByRowId } = query;
  const router = useRouter();
  const section = router.query.section as string;
  const [updateFormData] = useUpdateCbcDataAndInsertChangeRequest();
  const [changeReason, setChangeReason] = useState<null | string>(null);
  const [formData, setFormData] = useState<any>(null);

  const { cbcDataByCbcId, rowId } = cbcByRowId;
  const { jsonData, rowId: cbcDataRowId } = cbcDataByCbcId.edges[0].node;

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

  const dataBySection = {
    tombstone,
    projectType,
    locationsAndCounts,
    funding,
    eventsAndDates,
    miscellaneous,
    projectDataReviews,
  };

  const changeModal = useModal();

  const handleChangeRequestModal = (e) => {
    changeModal.open();
    setFormData({ ...dataBySection, [section]: e.formData });
  };

  const handleSubmit = () => {
    updateFormData({
      variables: {
        inputCbcData: {
          rowId: cbcDataRowId,
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
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: changeReason,
            cbcDataId: cbcDataRowId,
          },
        },
      },
      debounceKey: 'cbc_update_section_data',
      onCompleted: () => {
        router.push(`/analyst/cbc/${rowId}`);
      },
    });
  };

  return (
    <Layout title="Edit CBC Section" session={session}>
      <CbcAnalystLayout query={query}>
        <FormBase
          formData={dataBySection[section]}
          schema={review.properties[section] as RJSFSchema}
          theme={ProjectTheme}
          uiSchema={editUiSchema[section]}
          onSubmit={handleChangeRequestModal}
          noValidate
          noHtml5Validate
          omitExtraData={false}
        >
          <Button>Save</Button>
          <Button
            variant="secondary"
            style={{ marginLeft: '24px' }}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/analyst/cbc/${rowId}`);
            }}
          >
            Cancel
          </Button>
        </FormBase>
      </CbcAnalystLayout>
      <ChangeModal
        id="change-modal-cbc"
        onCancel={() => {
          setChangeReason(null);
          changeModal.close();
        }}
        value={changeReason}
        onChange={(e) => setChangeReason(e.target.value)}
        onSave={handleSubmit}
        {...changeModal}
      />
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.cbcId.toString(), 10),
      section: ctx.query.section,
    };
  },
};

export default withRelay(EditCbcSection, getCbcSectionQuery, withRelayOptions);
