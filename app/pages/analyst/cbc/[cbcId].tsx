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
import { useEffect, useMemo, useRef, useState } from 'react';
// import { ProjectTheme } from 'components/Analyst/Project';
import { useUpdateCbcDataByRowIdMutation } from 'schema/mutations/cbc/updateCbcData';
import review from 'formSchema/analyst/cbc/review';
import reviewUiSchema from 'formSchema/uiSchema/cbc/reviewUiSchema';
import editUiSchema from 'formSchema/uiSchema/cbc/editUiSchema';
import { useFeature } from '@growthbook/growthbook-react';
import CbcTheme from 'components/Analyst/CBC/CbcTheme';
import { createCbcSchemaData } from 'utils/schemaUtils';

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
  const allowEdit = useFeature('show_cbc_edit').value ?? false;
  const [toggleOverrideReadOnly, setToggleExpandOrCollapseAllReadOnly] =
    useState<boolean | undefined>(true);
  const [toggleOverrideEdit, setToggleExpandOrCollapseAllEdit] = useState<
    boolean | undefined
  >(true);
  const [editMode, setEditMode] = useState(false);
  const hiddenSubmitRef = useRef<HTMLButtonElement>(null);
  const { session } = query;
  const { rowId } = query.cbcByRowId;
  const [formData, setFormData] = useState({} as any);
  const [baseFormData, setBaseFormData] = useState({} as any);
  useEffect(() => {
    const { cbcByRowId } = query;
    const { cbcDataByCbcId } = cbcByRowId;
    const { edges } = cbcDataByCbcId;
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
    } = createCbcSchemaData(jsonData);

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

  const [updateFormData] = useUpdateCbcDataByRowIdMutation();

  const handleSubmit = (e) => {
    hiddenSubmitRef.current.click();
    e.preventDefault();
    updateFormData({
      variables: {
        input: {
          rowId: query?.cbcByRowId?.cbcDataByCbcId?.edges[0].node.rowId || null,
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
    setFormData(baseFormData);
    setEditMode(false);
  };

  const validate = (data) => {
    const errors: any = {};
    if (
      (data.funding?.bcFundingRequest || 0) +
        (data.funding?.federalFunding || 0) +
        (data.funding?.applicantAmount || 0) +
        (data.funding?.otherFunding || 0) !==
      data.funding?.totalProjectBudget
    ) {
      errors.funding = {
        totalProjectBudget: {
          __errors: [
            'Total project budget must equal the sum of the funding sources',
          ],
          color: '#f8e78f',
        },
      };
    }
    // append other validation logic here
    return errors;
  };

  const formErrors = useMemo(() => validate(formData), [formData]);

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
          {allowEdit && (
            <StyledButton
              onClick={() => {
                setEditMode(!editMode);
                setFormData(baseFormData);
              }}
              type="button"
            >
              {editMode ? 'Cancel quick edit' : 'Quick edit'}
            </StyledButton>
          )}
        </RightAlignText>
        <StyledCbcForm
          additionalContext={{
            toggleOverride: editMode
              ? toggleOverrideEdit
              : toggleOverrideReadOnly,
            isEditable: true,
            isCBC: true,
            cbcId: rowId,
            errors: formErrors,
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
          onSubmit={handleSubmit}
          setIsFormEditMode={setEditMode}
          saveBtnText="Save"
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
