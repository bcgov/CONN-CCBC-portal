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
import cbcTombstone from 'formSchema/analyst/cbc/tombstone';
import tombstoneUiSchema from 'formSchema/uiSchema/cbc/tombstoneUiSchema';
import projectType from 'formSchema/analyst/cbc/projectType';
import projectTypeUiSchema from 'formSchema/uiSchema/cbc/projectTypeUiSchema';
import locationsAndCounts from 'formSchema/analyst/cbc/locationsAndCounts';
import locationsAndCountsUiSchema from 'formSchema/uiSchema/cbc/locationsAndCountsUiSchema';
import funding from 'formSchema/analyst/cbc/funding';
import fundingUiSchema from 'formSchema/uiSchema/cbc/fundingUiSchema';
import eventsAndDates from 'formSchema/analyst/cbc/eventsAndDates';
import eventsAndDatesUiSchema from 'formSchema/uiSchema/cbc/eventsAndDatesUiSchema';
import miscellaneous from 'formSchema/analyst/cbc/miscellaneous';
import miscellaneousUiSchema from 'formSchema/uiSchema/cbc/miscellaneousUiSchema';
import projectDataReviews from 'formSchema/analyst/cbc/projectDataReviews';
import projectDataReviewsUiSchema from 'formSchema/uiSchema/cbc/projectDataReviewsUiSchema';
import { useState } from 'react';

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

const Cbc = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, CbcIdQuery>) => {
  const query = usePreloadedQuery(getCbcQuery, preloadedQuery);

  const [toggleOverride, setToggleExpandOrCollapseAll] = useState<
    boolean | undefined
  >(undefined);

  const { cbcByRowId, session } = query;
  const { cbcDataByCbcId } = cbcByRowId;
  const { edges } = cbcDataByCbcId;
  const cbcData = edges[0].node;
  const { jsonData } = cbcData;

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

  return (
    <Layout session={session} title="Connecting Communities BC">
      <CbcAnalystLayout query={query}>
        <RightAlignText>
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
          <StyledButton
            onClick={() => {
              console.log('Quick edit');
            }}
            type="button"
          >
            Quick edit
          </StyledButton>
        </RightAlignText>
        <>
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Tombstone"
            schema={cbcTombstone}
            theme={ReviewTheme}
            uiSchema={tombstoneUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Project type"
            schema={projectType}
            theme={ReviewTheme}
            uiSchema={projectTypeUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Locations and counts"
            schema={locationsAndCounts}
            theme={ReviewTheme}
            uiSchema={locationsAndCountsUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Locations and counts"
            schema={funding}
            theme={ReviewTheme}
            uiSchema={fundingUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Locations and counts"
            schema={eventsAndDates}
            theme={ReviewTheme}
            uiSchema={eventsAndDatesUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Locations and counts"
            schema={miscellaneous}
            theme={ReviewTheme}
            uiSchema={miscellaneousUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
          <StyledCbcForm
            formData={jsonData}
            handleChange={(e) => {
              console.log(e);
            }}
            isExpanded
            isFormEditMode={false}
            title="Locations and counts"
            schema={projectDataReviews}
            theme={ReviewTheme}
            uiSchema={projectDataReviewsUiSchema}
            resetFormData={() => {
              console.log('handleReset');
            }}
            onSubmit={() => {
              console.log('handleSubmit');
            }}
            setIsFormEditMode={() => {
              console.log('setIsFormEditMode');
            }}
            additionalContext={{ toggleOverride }}
            isFormAnimated={false}
          />
        </>
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
