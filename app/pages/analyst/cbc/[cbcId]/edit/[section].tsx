import { SectionCbcDataQuery } from '__generated__/SectionCbcDataQuery.graphql';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import { usePreloadedQuery } from 'react-relay';
import { RelayProps, withRelay } from 'relay-nextjs';
import { graphql } from 'relay-runtime';
import review from 'formSchema/analyst/cbc/review';
import { ProjectTheme } from 'components/Analyst/Project';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { FormBase } from 'components/Form';
import { Button } from '@button-inc/bcgov-theme';
import { RJSFSchema } from '@rjsf/utils';
import useModal from 'lib/helpers/useModal';
import { ChangeModal } from 'components/Analyst';
import { useUpdateCbcDataAndInsertChangeRequest } from 'schema/mutations/cbc/updateCbcDataAndInsertChangeReason';
import {
  createCbcSchemaData,
  generateGeographicNamesByRegionalDistrict,
  generateRegionalDistrictsByEconomicRegion,
  getAllEconomicRegionNames,
} from 'utils/schemaUtils';
import ArrayLocationFieldTemplate from 'lib/theme/fields/ArrayLocationDataField';
import { useUpdateCbcCommunityDataMutationMutation } from 'schema/mutations/cbc/updateCbcCommunityData';
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
      cbcProjectCommunitiesByCbcId(filter: { archivedAt: { isNull: true } }) {
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
        geographicNameId
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
  const [addedCommunities, setAddedCommunities] = useState([]);
  const [removedCommunities, setRemovedCommunities] = useState([]);

  const { cbcDataByCbcId, rowId, cbcProjectCommunitiesByCbcId } = cbcByRowId;
  const { jsonData, rowId: cbcDataRowId } = cbcDataByCbcId.edges[0].node;

  useEffect(() => {
    const cbcCommunitiesData =
      cbcProjectCommunitiesByCbcId.nodes?.map(
        (node) => node.communitiesSourceDataByCommunitiesSourceDataId
      ) || [];
    setFormData(
      createCbcSchemaData({
        ...jsonData,
        cbcCommunitiesData,
      })
    );
  }, [jsonData, cbcProjectCommunitiesByCbcId]);

  const changeModal = useModal();

  const addCommunity = (communityId) => {
    setAddedCommunities((prevList) => [...prevList, communityId]);
  };

  const removeCommunity = (communityId) => {
    setRemovedCommunities((prevList) => [...prevList, communityId]);
    const indexOfRemovedCommunity =
      formData.locations?.communitySourceData?.findIndex(
        (community) => community.geographicNameId === communityId
      );
    setFormData({
      ...formData,
      locations: {
        ...formData.locations,
        communitySourceData: [
          ...formData.locations.communitySourceData.slice(
            0,
            indexOfRemovedCommunity
          ),
          ...formData.locations.communitySourceData.slice(
            indexOfRemovedCommunity + 1
          ),
        ],
      },
    });
  };

  const handleAddClick = (formPayload) => {
    const communitySourceArray = formPayload.communitySourceData as Array<any>;
    const communitySourceArrayLength = formPayload.communitySourceData?.length;
    if (communitySourceArray[communitySourceArrayLength - 1] === undefined) {
      if (communitySourceArray[0])
        addCommunity(communitySourceArray[0].geographicNameId);
      return {
        ...formPayload,
        communitySourceData: [
          {},
          // setRowId to make widget readonly
          { ...communitySourceArray[0], rowId: true },
          ...communitySourceArray.slice(1, communitySourceArrayLength - 1),
        ],
      };
    }
    return formPayload;
  };

  const [updateCbcCommunitySourceData] =
    useUpdateCbcCommunityDataMutationMutation();

  const handleOnChange = (e) => {
    if (section === 'locations') {
      setFormData({
        ...formData,
        [section]: handleAddClick(e.formData),
      });
    } else setFormData({ ...formData, [section]: e.formData });
  };

  const handleUpdateCommunitySource = useCallback(() => {
    updateCbcCommunitySourceData({
      variables: {
        input: {
          _projectId: rowId,
          _communityIdsToAdd: addedCommunities,
          _communityIdsToArchive: removedCommunities,
        },
      },
      debounceKey: 'cbc_update_community_source_data',
      onCompleted: () => {
        setAddedCommunities([]);
        setRemovedCommunities([]);
      },
    });
  }, [
    addedCommunities,
    removedCommunities,
    updateCbcCommunitySourceData,
    rowId,
  ]);

  const handleChangeRequestModal = (e) => {
    changeModal.open();
    setFormData({ ...formData, [section]: e.formData });
  };

  const allCommunitiesSourceData = query.allCommunitiesSourceData.nodes;

  const geographicNamesByRegionalDistrict = useMemo(() => {
    return generateGeographicNamesByRegionalDistrict(allCommunitiesSourceData);
  }, [allCommunitiesSourceData]);

  const regionalDistrictsByEconomicRegion = useMemo(() => {
    return generateRegionalDistrictsByEconomicRegion(allCommunitiesSourceData);
  }, [allCommunitiesSourceData]);

  const allEconomicRegions = useMemo(() => {
    return getAllEconomicRegionNames(allCommunitiesSourceData);
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
    const { projectLocations } = formData.locations;
    updateFormData({
      variables: {
        inputCbcData: {
          rowId: cbcDataRowId,
          cbcDataPatch: {
            jsonData: {
              ...formData.tombstone,
              ...formData.projectType,
              projectLocations,
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
        handleUpdateCommunitySource();
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
    () => validateSection(formData ?? {}, review.properties[section]),
    [formData, section, validateSection]
  );

  return (
    <Layout title="Edit CBC Section" session={session}>
      <CbcAnalystLayout query={query} isFormEditable>
        <FormBase
          formData={formData?.[section] ?? {}}
          schema={review.properties[section] as RJSFSchema}
          theme={theme}
          uiSchema={editUiSchema[section]}
          onSubmit={handleChangeRequestModal}
          noValidate
          noHtml5Validate
          omitExtraData={false}
          onChange={handleOnChange}
          formContext={{
            economicRegions: allEconomicRegions,
            regionalDistrictsByEconomicRegion,
            geographicNamesByRegionalDistrict,
            allCommunitiesSourceData,
            addCommunitySource: addCommunity,
            deleteCommunitySource: removeCommunity,
            errors: formErrors,
            showErrorHint: true,
            cbcCommunitiesData:
              query.cbcByRowId.cbcProjectCommunitiesByCbcId.nodes,
            addedCommunities,
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
