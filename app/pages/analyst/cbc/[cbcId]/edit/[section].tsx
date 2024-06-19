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
import { createCbcSchemaData } from 'utils/schemaUtils';

const getCbcSectionQuery = graphql`
  query SectionCbcDataQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId(first: 500) {
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
      cbcProjectCommunitiesByCbcId {
        nodes {
          communitiesSourceDataByCommunitiesSourceDataId {
            economicRegion
            geographicNameId
            geographicType
            regionalDistrict
            bcGeographicName
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

  const { cbcDataByCbcId, rowId, cbcProjectCommunitiesByCbcId } = cbcByRowId;
  const { jsonData, rowId: cbcDataRowId } = cbcDataByCbcId.edges[0].node;
  const cbcCommunitiesData =
    cbcProjectCommunitiesByCbcId.nodes?.map(
      (node) => node.communitiesSourceDataByCommunitiesSourceDataId
    ) || [];

  const dataBySection = createCbcSchemaData({
    ...jsonData,
    cbcCommunitiesData,
  });

  const changeModal = useModal();

  const handleChangeRequestModal = (e) => {
    changeModal.open();
    setFormData({ ...dataBySection, [section]: e.formData });
  };

  const handleSubmit = () => {
    const {
      geographicNames,
      regionalDistricts,
      economicRegions,
      ...updatedLocationsAndCounts
    } = formData.locationsAndCounts;
    updateFormData({
      variables: {
        inputCbcData: {
          rowId: cbcDataRowId,
          cbcDataPatch: {
            jsonData: {
              ...formData.tombstone,
              ...formData.projectType,
              ...updatedLocationsAndCounts,
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
