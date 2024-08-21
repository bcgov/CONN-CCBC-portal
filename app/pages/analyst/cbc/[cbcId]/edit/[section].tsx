import { SectionCbcDataQuery } from '__generated__/SectionCbcDataQuery.graphql';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { usePreloadedQuery } from 'react-relay';
import { RelayProps, withRelay } from 'relay-nextjs';
import { graphql } from 'relay-runtime';
import review from 'formSchema/analyst/cbc/review';
import { ProjectTheme } from 'components/Analyst/Project';
import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { FormBase } from 'components/Form';
import { Button } from '@button-inc/bcgov-theme';
import { RJSFSchema } from '@rjsf/utils';
import useModal from 'lib/helpers/useModal';
import { ChangeModal } from 'components/Analyst';
import { useUpdateCbcDataAndInsertChangeRequest } from 'schema/mutations/cbc/updateCbcDataAndInsertChangeReason';
import { createCbcSchemaData } from 'utils/schemaUtils';
import ArrayLocationFieldTemplate from 'lib/theme/fields/ArrayLocationDataField';
import customValidate, { CBC_WARN_COLOR } from 'utils/cbcCustomValidator';

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
            rowId
          }
        }
      }
    }
    allCommunitiesSourceData {
      nodes {
        rowId
        bcGeographicName
        economicRegion
        regionalDistrict
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

  const allCommunitiesSourceData = query.allCommunitiesSourceData.nodes;

  const geographicNamesByRegionalDistrict = useMemo(() => {
    const regionalDistrictGeographicNamesDict = {};
    allCommunitiesSourceData.forEach((community) => {
      const {
        regionalDistrict,
        bcGeographicName,
        rowId: communityRowId,
      } = community;
      if (!regionalDistrictGeographicNamesDict[regionalDistrict]) {
        regionalDistrictGeographicNamesDict[regionalDistrict] = new Set();
      }
      regionalDistrictGeographicNamesDict[regionalDistrict].add({
        label: bcGeographicName,
        value: communityRowId,
      });
    });
    return regionalDistrictGeographicNamesDict;
  }, [allCommunitiesSourceData]);

  const regionalDistrictsByEconomicRegion = useMemo(() => {
    const districtByEconomicRegionDict = {};
    allCommunitiesSourceData.forEach((community) => {
      const { economicRegion, regionalDistrict } = community;
      if (!districtByEconomicRegionDict[economicRegion]) {
        districtByEconomicRegionDict[economicRegion] = new Set();
      }
      districtByEconomicRegionDict[economicRegion].add(regionalDistrict);
    });
    return districtByEconomicRegionDict;
  }, [allCommunitiesSourceData]);

  const allEconomicRegions = useMemo(() => {
    const economicRegionsSet = new Set();
    allCommunitiesSourceData.forEach((community) => {
      const { economicRegion } = community;
      economicRegionsSet.add(economicRegion);
    });
    return [...economicRegionsSet];
  }, [allCommunitiesSourceData]);

  const theme = { ...ProjectTheme };
  theme.templates.ArrayFieldTemplate = ArrayLocationFieldTemplate;

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

  const validateSection = useCallback(
    (data, schema) => {
      const sectionErrors: any = {};
      if (!schema?.properties) return sectionErrors;

      Object.keys(schema.properties).forEach((fieldKey) => {
        const fieldErrorList = customValidate(data, section, fieldKey);
        if (fieldErrorList.length > 0) {
          sectionErrors[fieldKey] = {
            __errors: fieldErrorList,
            errorColor: CBC_WARN_COLOR,
          };
        }
      });

      return sectionErrors;
    },
    [section]
  );

  const formErrors = useMemo(
    () =>
      validateSection(formData || dataBySection, review.properties[section]),
    [dataBySection, formData, section, validateSection]
  );

  return (
    <Layout title="Edit CBC Section" session={session}>
      <CbcAnalystLayout query={query} isFormEditable>
        <FormBase
          formData={formData?.[section] || dataBySection[section]}
          schema={review.properties[section] as RJSFSchema}
          theme={theme}
          uiSchema={editUiSchema[section]}
          onSubmit={handleChangeRequestModal}
          noValidate
          noHtml5Validate
          omitExtraData={false}
          formContext={{
            economicRegions: allEconomicRegions,
            regionalDistrictsByEconomicRegion,
            geographicNamesByRegionalDistrict,
            allCommunitiesSourceData,
            errors: formErrors,
            showErrorHint: true,
          }}
          onChange={(e) => {
            setFormData({ ...dataBySection, [section]: e.formData });
          }}
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
        saveDisabled={changeReason === null || changeReason.trim() === ''}
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
