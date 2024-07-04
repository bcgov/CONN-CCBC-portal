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
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const isCbcAdmin = query.session.authRole === 'cbc_admin';
  const editFeatureEnabled = useFeature('show_cbc_edit').value ?? false;
  const allowEdit = isCbcAdmin && editFeatureEnabled;
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
  const recordLocked = formData?.projectDataReviews?.locked;

  const changeModal = useModal();

  useEffect(() => {
    const { cbcByRowId } = query;
    const { cbcDataByCbcId, cbcProjectCommunitiesByCbcId } = cbcByRowId;
    const { edges } = cbcDataByCbcId;
    const cbcCommunitiesData = cbcProjectCommunitiesByCbcId.nodes?.map(
      (node) => node.communitiesSourceDataByCommunitiesSourceDataId
    );
    const cbcData = edges[0].node;
    const { jsonData } = cbcData;

    const {
      tombstone,
      projectType,
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
      locationsAndCounts,
      funding,
      eventsAndDates,
      miscellaneous,
      projectDataReviews,
    });
    setBaseFormData({
      tombstone,
      projectType,
      locationsAndCounts,
      funding,
      eventsAndDates,
      miscellaneous,
      projectDataReviews,
    });
  }, [query]);

  const [updateFormData] = useUpdateCbcDataAndInsertChangeRequest();

  const handleChangeRequestModal = () => {
    changeModal.open();
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
      },
    });
  };

  const handleResetFormData = () => {
    setFormData(baseFormData);
    setEditMode(false);
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
      <CbcAnalystLayout query={query} isFormEditMode={editMode}>
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
          {allowEdit && getQuickEditButton()}
        </RightAlignText>
        <StyledCbcForm
          additionalContext={{
            toggleOverride: editMode
              ? toggleOverrideEdit
              : toggleOverrideReadOnly,
            isEditable: allowEdit,
            isCBC: true,
            cbcId: rowId,
            errors: formErrors,
            showErrorHint: true,
            recordLocked,
          }}
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
