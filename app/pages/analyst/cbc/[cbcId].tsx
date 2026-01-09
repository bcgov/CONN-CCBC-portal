import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { CbcIdQuery } from '__generated__/CbcIdQuery.graphql';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import { ChangeModal } from 'components/Analyst';
import styled from 'styled-components';
import ReviewTheme from 'components/Review/ReviewTheme';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useUpdateCbcDataAndInsertChangeRequest } from 'schema/mutations/cbc/updateCbcDataAndInsertChangeReason';
import review from 'formSchema/analyst/cbc/review';
import reviewUiSchema from 'formSchema/uiSchema/cbc/reviewUiSchema';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { useFeature } from '@growthbook/growthbook-react';
import CbcTheme from 'components/Analyst/CBC/CbcTheme';
import {
  createCbcSchemaData,
  generateGeographicNamesByRegionalDistrict,
  generateRegionalDistrictsByEconomicRegion,
  getAllEconomicRegionNames,
} from 'utils/schemaUtils';
import customValidate, { CBC_WARN_COLOR } from 'utils/cbcCustomValidator';
import CbcRecordLock from 'components/Analyst/CBC/CbcRecordLock';
import useModal from 'lib/helpers/useModal';
import { useRouter } from 'next/router';

const getCbcQuery = graphql`
  query CbcIdQuery($rowId: Int!) {
    cbcByRowId(rowId: $rowId) {
      projectNumber
      rowId
      sharepointTimestamp
      cbcDataByCbcId(first: 500) @connection(key: "CbcData__cbcDataByCbcId") {
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
      applicationMergesByParentCbcId(
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
      cbcProjectCommunitiesByCbcId(filter: { archivedAt: { isNull: true } }) {
        __id
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
        geographicType
      }
    }
    session {
      authRole
      sub
      authRole
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
  const router = useRouter();
  const { recent } = router.query;
  const query = usePreloadedQuery(getCbcQuery, preloadedQuery);
  const isCbcAdmin =
    query.session.authRole === 'cbc_admin' ||
    query.session.authRole === 'super_admin';
  const editFeatureEnabled = useFeature('show_cbc_edit').value ?? false;
  const { session } = query;

  const [toggleOverrideReadOnly, setToggleExpandOrCollapseAllReadOnly] =
    useState<boolean | undefined>(true);
  const [toggleOverrideEdit, setToggleExpandOrCollapseAllEdit] = useState<
    boolean | undefined
  >(true);
  const [editMode, setEditMode] = useState(recent === 'true');
  const [changeReason, setChangeReason] = useState<null | string>(null);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapData] = useState({}); // Empty map data for CBC

  const { rowId, applicationMergesByParentCbcId } = query.cbcByRowId;
  const [formData, setFormData] = useState(null);
  const [baseFormData, setBaseFormData] = useState({} as any);
  const [addedCommunities, setAddedCommunities] = useState([]);
  const [removedCommunities, setRemovedCommunities] = useState([]);
  const [responseCommunityData, setResponseCommunityData] = useState([]);

  const addCommunity = (communityId) => {
    setAddedCommunities((prevList) => [...prevList, communityId]);
  };

  const removeCommunity = (communityId) => {
    setRemovedCommunities((prevList) => [...prevList, communityId]);
    const indexOfRemovedCommunity =
      formData.locations.communitySourceData.findIndex(
        (community) => community.geographicNameId === communityId
      );
    setFormData((prevFormData) => ({
      ...prevFormData,
      locations: {
        ...prevFormData.locations,
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
    }));
  };

  const handleAddClick = (formPayload) => {
    const communitySourceArray = formPayload.locations
      .communitySourceData as Array<any>;
    const communitySourceArrayLength =
      formPayload.locations.communitySourceData?.length;
    if (communitySourceArray[communitySourceArrayLength - 1] === undefined) {
      if (communitySourceArray[0])
        addCommunity(communitySourceArray[0].geographicNameId);
      return {
        ...formPayload,
        locations: {
          ...formPayload.locations,
          communitySourceData: [
            {},
            // done to ensure that the added piece is now readonly
            { ...communitySourceArray[0], rowId: true },
            ...communitySourceArray.slice(1, communitySourceArrayLength - 1),
          ],
        },
      };
    }
    return formPayload;
  };

  const changeModal = useModal();

  const [recordLocked, setRecordLocked] = useState(false);
  const [allowEdit, setAllowEdit] = useState(
    isCbcAdmin && editFeatureEnabled && !recordLocked
  );

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

  const cbcCommunitiesData = useMemo(() => {
    if (responseCommunityData.length > 0) return responseCommunityData;
    return query.cbcByRowId.cbcProjectCommunitiesByCbcId.nodes?.map(
      (node) => node.communitiesSourceDataByCommunitiesSourceDataId
    );
  }, [query, responseCommunityData]);

  useEffect(() => {
    const { cbcByRowId } = query;
    const { cbcDataByCbcId } = cbcByRowId;

    const { edges } = cbcDataByCbcId;
    const cbcData = edges[0].node;
    const { jsonData } = cbcData;

    const childProjects =
      applicationMergesByParentCbcId?.edges?.map((child) => {
        const childId = child?.node?.childApplicationId;
        const childCcbcNumber =
          child?.node?.applicationByChildApplicationId?.ccbcNumber;

        return {
          name: childCcbcNumber,
          ccbcNumber: childCcbcNumber,
          link: `/analyst/application/${childId}/summary`,
          rowId: childId,
        };
      }) ?? [];

    const {
      tombstone,
      projectType,
      locations,
      locationsAndCounts,
      funding,
      eventsAndDates,
      miscellaneous,
      projectDataReviews,
    } = createCbcSchemaData({
      ...jsonData,
      cbcCommunitiesData,
      childProjects,
    });

    setFormData({
      tombstone,
      projectType,
      locations,
      locationsAndCounts,
      funding,
      eventsAndDates,
      miscellaneous,
      projectDataReviews,
    });
    setBaseFormData({
      tombstone,
      projectType,
      locations,
      locationsAndCounts,
      funding,
      eventsAndDates,
      miscellaneous,
      projectDataReviews,
    });
    setRecordLocked(projectDataReviews?.locked || false);
    setAllowEdit(
      isCbcAdmin && editFeatureEnabled && !projectDataReviews?.locked
    );
  }, [
    query,
    isCbcAdmin,
    editFeatureEnabled,
    cbcCommunitiesData,
    applicationMergesByParentCbcId,
  ]);

  const [updateFormData] = useUpdateCbcDataAndInsertChangeRequest();

  const handleChangeRequestModal = () => {
    setChangeReason(null);
    changeModal.open();
  };

  const handleSubmit = () => {
    const {
      geographicNames,
      regionalDistricts,
      economicRegions,
      ...updatedLocationsAndCounts
    } = formData.locationsAndCounts;
    const { projectLocations, zones } = formData.locations;
    const { childProjects, ...miscellaneous } = formData.miscellaneous || {};
    updateFormData({
      variables: {
        inputCbcData: {
          rowId: query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId || null,
          cbcDataPatch: {
            jsonData: {
              // TODO: Update when working on NDT-725
              ...query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.jsonData,
              ...formData.tombstone,
              ...formData.projectType,
              zones,
              projectLocations,
              ...updatedLocationsAndCounts,
              ...formData.funding,
              ...formData.eventsAndDates,
              ...miscellaneous,
              ...formData.projectDataReviews,
            },
            changeReason,
          },
        },
        inputCbcChangeReason: {
          cbcDataChangeReason: {
            description: changeReason,
            cbcDataId:
              query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId || null,
          },
        },
        inputCbcProjectCommunities: {
          _projectId: rowId,
          _communityIdsToAdd: addedCommunities,
          _communityIdsToArchive: removedCommunities,
        },
      },
      debounceKey: 'cbc_update_form_data',
      onCompleted: (response) => {
        setEditMode(false);
        changeModal.close();
        setAddedCommunities([]);
        setRemovedCommunities([]);
        setResponseCommunityData(
          response.editCbcProjectCommunities.cbcProjectCommunities.map(
            (proj) => proj.communitiesSourceDataByCommunitiesSourceDataId
          )
        );
        setAllowEdit(isCbcAdmin && editFeatureEnabled);
      },
    });
  };

  const handleResetFormData = () => {
    setFormData(baseFormData);
    setEditMode(false);
    setAllowEdit(isCbcAdmin && editFeatureEnabled);
  };

  const validate = (data, schema) => {
    const errors: any = {};
    if (!schema?.properties) return errors;

    Object.entries(schema?.properties).forEach(
      ([key, property]: [string, any]) => {
        const fieldErrors = {};

        Object.keys(property.properties).forEach((fieldKey) => {
          // validate custom rules for fields
          const fieldErrorList = customValidate(data, key, fieldKey);

          // add required field error if no other custom validation errors
          if (
            fieldErrorList.length === 0 &&
            property.required?.includes(fieldKey) &&
            !data[key]?.[fieldKey]
          ) {
            fieldErrorList.push('Please enter a value');
          }

          if (fieldErrorList.length > 0) {
            fieldErrors[fieldKey] = {
              __errors: fieldErrorList,
              errorColor: CBC_WARN_COLOR,
            };
          }
        });

        if (Object.keys(fieldErrors).length > 0) {
          errors[key] = fieldErrors;
        }
      }
    );

    return errors;
  };

  const formErrors = useMemo(
    () => validate(formData || {}, review),
    [formData]
  );

  const handleQuickEditClick = (isEditMode: boolean) => {
    setEditMode(isEditMode);
    setAllowEdit(isEditMode);
    setFormData(baseFormData);
  };

  const getQuickEditButton = () => {
    if (recordLocked && !editMode) {
      return (
        <CbcRecordLock
          id="record-lock"
          onConfirm={() => handleQuickEditClick(true)}
        />
      );
    }
    return (
      <StyledButton
        onClick={() => handleQuickEditClick(!editMode)}
        type="button"
      >
        {editMode ? 'Cancel quick edit' : 'Quick edit'}
      </StyledButton>
    );
  };

  return (
    <Layout session={session} title="Connecting Communities BC">
      <CbcAnalystLayout
        query={query}
        isFormEditable={allowEdit}
        key={rowId}
        mapData={mapData}
        isMapExpanded={isMapExpanded}
        setIsMapExpanded={setIsMapExpanded}
      >
        <h2>Project</h2>
        <RightAlignText>
          <>
            <StyledButton
              onClick={() => {
                if (editMode) {
                  setToggleExpandOrCollapseAllEdit(true);
                  return;
                }
                setToggleExpandOrCollapseAllReadOnly(true);
              }}
              type="button"
            >
              Expand all
            </StyledButton>
            {' | '}
            <StyledButton
              onClick={() => {
                if (editMode) {
                  setToggleExpandOrCollapseAllEdit(false);
                  return;
                }
                setToggleExpandOrCollapseAllReadOnly(false);
              }}
              type="button"
            >
              Collapse all
            </StyledButton>
            {' | '}
          </>
          {isCbcAdmin && editFeatureEnabled && getQuickEditButton()}
        </RightAlignText>
        <StyledCbcForm
          additionalContext={{
            toggleOverride: editMode
              ? toggleOverrideEdit
              : toggleOverrideReadOnly,
            isEditable: isCbcAdmin && editFeatureEnabled,
            isCBC: true,
            cbcId: rowId,
            errors: formErrors,
            showErrorHint: true,
            recordLocked,
            editMode,
            geographicNamesByRegionalDistrict,
            allCommunitiesSourceData,
            regionalDistrictsByEconomicRegion,
            economicRegions: allEconomicRegions,
            cbcCommunitiesData:
              query.cbcByRowId.cbcProjectCommunitiesByCbcId.nodes,
            addedCommunities,
            addCommunitySource: addCommunity,
            deleteCommunitySource: removeCommunity,
          }}
          formData={formData}
          handleChange={(e) => {
            setFormData(handleAddClick(e.formData));
          }}
          hiddenSubmitRef={hiddenSubmitRef}
          isExpanded
          isFormAnimated={false}
          isFormEditMode={editMode}
          title="CBC Form"
          schema={review}
          theme={editMode ? CbcTheme : ReviewTheme}
          uiSchema={editMode ? editUiSchema : reviewUiSchema}
          resetFormData={handleResetFormData}
          onSubmit={handleChangeRequestModal}
          setIsFormEditMode={setEditMode}
          saveBtnText="Save"
        />
      </CbcAnalystLayout>
      <ChangeModal
        id="change-modal-cbc"
        onCancel={() => {
          setChangeReason(null);
          setFormData(baseFormData);
          setEditMode(false);
          setAddedCommunities([]);
          setRemovedCommunities([]);
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
    };
  },
};

export default withRelay(Cbc, getCbcQuery, withRelayOptions);
