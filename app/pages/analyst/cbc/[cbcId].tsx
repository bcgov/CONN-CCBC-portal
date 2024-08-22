import { graphql } from 'react-relay';
import { usePreloadedQuery } from 'react-relay/hooks';
import { withRelay, RelayProps } from 'relay-nextjs';
import { CbcIdQuery } from '__generated__/CbcIdQuery.graphql';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import Layout from 'components/Layout';
import CbcAnalystLayout from 'components/Analyst/CBC/CbcAnalystLayout';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import { ChangeModal } from 'components/Analyst';
import styled from 'styled-components';
import ReviewTheme from 'components/Review/ReviewTheme';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUpdateCbcDataAndInsertChangeRequest } from 'schema/mutations/cbc/updateCbcDataAndInsertChangeReason';
import review from 'formSchema/analyst/cbc/review';
import reviewUiSchema from 'formSchema/uiSchema/cbc/reviewUiSchema';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { useFeature } from '@growthbook/growthbook-react';
import CbcTheme from 'components/Analyst/CBC/CbcTheme';
import { createCbcSchemaData } from 'utils/schemaUtils';
import customValidate, { CBC_WARN_COLOR } from 'utils/cbcCustomValidator';
import CbcRecordLock from 'components/Analyst/CBC/CbcRecordLock';
import useModal from 'lib/helpers/useModal';
import { useUpdateCbcCommunityDataMutationMutation } from 'schema/mutations/cbc/updateCbcCommunityData';

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
      cbcProjectCommunitiesByCbcId(filter: { archivedAt: { isNull: true } }) {
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
    allCommunitiesSourceData {
      nodes {
        geographicNameId
        bcGeographicName
        economicRegion
        regionalDistrict
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
  const [editMode, setEditMode] = useState(false);
  const [changeReason, setChangeReason] = useState<null | string>(null);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);

  const { rowId } = query.cbcByRowId;
  const [formData, setFormData] = useState({} as any);
  const [baseFormData, setBaseFormData] = useState({} as any);
  const [addedCommunities, setAddedCommunities] = useState([]);
  const [removedCommunities, setRemovedCommunities] = useState([]);

  const addCommunity = (communityId) => {
    setAddedCommunities((prevList) => [...prevList, communityId]);
  };

  const removeCommunity = (communityId) => {
    setRemovedCommunities((prevList) => [...prevList, communityId]);
    const indexOfRemovedCommunity =
      formData.locations.communitySourceData.findIndex(
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
    const communitySourceArray = formPayload.locations
      .communitySourceData as Array<any>;
    const communitySourceArrayLength =
      formPayload.locations.communitySourceData.length;
    if (communitySourceArray[communitySourceArrayLength - 1] === undefined) {
      console.log({
        ...formPayload,
        locations: {
          ...formPayload.locations,
          communitySourceData: [
            {},
            ...communitySourceArray.slice(0, communitySourceArrayLength - 1),
          ],
        },
      });
      if (communitySourceArray[0])
        addCommunity(communitySourceArray[0].geographicNameId);
      return {
        ...formPayload,
        locations: {
          ...formPayload.locations,
          communitySourceData: [
            {},
            ...communitySourceArray.slice(0, communitySourceArrayLength - 1),
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
    const regionalDistrictGeographicNamesDict = {};
    allCommunitiesSourceData.forEach((community) => {
      const { regionalDistrict, bcGeographicName, geographicNameId } =
        community;
      if (!regionalDistrictGeographicNamesDict[regionalDistrict]) {
        regionalDistrictGeographicNamesDict[regionalDistrict] = new Set();
      }
      regionalDistrictGeographicNamesDict[regionalDistrict].add({
        label: bcGeographicName,
        value: geographicNameId,
      });
    });
    return regionalDistrictGeographicNamesDict;
  }, [allCommunitiesSourceData]);

  const regionalDistrictsByEconomicRegion = useMemo(() => {
    const economicRegionRegionalDistrictsDict = {};
    allCommunitiesSourceData.forEach((community) => {
      const { economicRegion, regionalDistrict } = community;
      if (!economicRegionRegionalDistrictsDict[economicRegion]) {
        economicRegionRegionalDistrictsDict[economicRegion] = new Set();
      }
      economicRegionRegionalDistrictsDict[economicRegion].add(regionalDistrict);
    });

    return economicRegionRegionalDistrictsDict;
  }, [allCommunitiesSourceData]);

  const allEconomicRegions = useMemo(() => {
    const economicRegionsSet = new Set();
    allCommunitiesSourceData.forEach((community) => {
      const { economicRegion } = community;
      economicRegionsSet.add(economicRegion);
    });
    return [...economicRegionsSet];
  }, [allCommunitiesSourceData]);

  const cbcCommunitiesData = useMemo(() => {
    return query.cbcByRowId.cbcProjectCommunitiesByCbcId.nodes?.map(
      (node) => node.communitiesSourceDataByCommunitiesSourceDataId
    );
  }, [query]);

  useEffect(() => {
    const { cbcByRowId } = query;
    const { cbcDataByCbcId } = cbcByRowId;

    const { edges } = cbcDataByCbcId;
    const cbcData = edges[0].node;
    const { jsonData } = cbcData;

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
  }, [query, isCbcAdmin, editFeatureEnabled, cbcCommunitiesData]);

  const [updateFormData] = useUpdateCbcDataAndInsertChangeRequest();
  const [updateCbcCommunitySourceData] =
    useUpdateCbcCommunityDataMutationMutation();

  const handleChangeRequestModal = () => {
    setChangeReason(null);
    changeModal.open();
  };

  const handleUpdateCommunitySource = useCallback(() => {
    console.log(addedCommunities, removedCommunities);
    updateCbcCommunitySourceData({
      variables: {
        input: {
          _projectId: query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId,
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
    query,
  ]);

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
          rowId: query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId || null,
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
            cbcDataId:
              query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId || null,
          },
        },
      },
      debounceKey: 'cbc_update_form_data',
      onCompleted: () => {
        setEditMode(false);
        changeModal.close();
        handleUpdateCommunitySource();
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

  const formErrors = useMemo(() => validate(formData, review), [formData]);

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
      <CbcAnalystLayout query={query} isFormEditable={allowEdit}>
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
            geographicNamesByRegionalDistrict,
            regionalDistrictsByEconomicRegion,
            economicRegions: allEconomicRegions,
            cbcCommunitiesData:
              query.cbcByRowId.cbcProjectCommunitiesByCbcId.nodes,
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
