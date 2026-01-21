/* eslint-disable react-hooks/exhaustive-deps */
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { usePreloadedQuery, graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import Layout from 'components/Layout';
import cookie from 'js-cookie';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { summaryQuery } from '__generated__/summaryQuery.graphql';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import ReviewTheme from 'components/Review/ReviewTheme';
import reviewUiSchema from 'formSchema/uiSchema/summary/reviewUiSchema';
import review from 'formSchema/analyst/summary/review';
import map from 'formSchema/analyst/summary/map';
import styled from 'styled-components';
import { Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import generateFormData from 'lib/helpers/ccbcSummaryGenerateFormData';
import { useRouter } from 'next/router';
import Link from 'next/link';
import mapUiSchema from 'formSchema/uiSchema/summary/mapUiSchema';
import { useFeature } from '@growthbook/growthbook-react';
import useApplicationMerge from 'lib/helpers/useApplicationMerge';

const getSummaryQuery = graphql`
  query summaryQuery($rowId: Int!) {
    session {
      sub
      authRole
    }
    applicationByRowId(rowId: $rowId) {
      announcements {
        totalCount
      }
      applicationAnnouncedsByApplicationId(
        last: 1
        condition: { archivedAt: null }
      ) {
        nodes {
          announced
        }
      }
      applicationDependenciesByApplicationId(first: 1) {
        nodes {
          jsonData
        }
      }
      parentApplicationMerge: applicationMergesByChildApplicationId(
        first: 1
        filter: { archivedAt: { isNull: true } }
        orderBy: CREATED_AT_DESC
      ) {
        edges {
          node {
            parentCbcId
            parentApplicationId
            applicationByParentApplicationId {
              ccbcNumber
            }
            cbcByParentCbcId {
              projectNumber
            }
          }
        }
      }
      childApplicationMerge: applicationMergesByParentApplicationId(
        filter: { archivedAt: { isNull: true } }
        orderBy: CREATED_AT_DESC
      ) {
        edges {
          node {
            childApplicationId
            applicationByChildApplicationId {
              ccbcNumber
            }
          }
        }
      }
      applicationFnhaContributionsByApplicationId {
        edges {
          node {
            id
            fnhaContribution
          }
        }
      }
      applicationStatusesByApplicationId(
        filter: { status: { equalTo: "received" } }
      ) {
        nodes {
          createdAt
          status
        }
      }
      allAssessments {
        nodes {
          assessmentDataType
          jsonData
        }
      }
      formData {
        jsonData
      }
      projectInformationDataByApplicationId(last: 1) {
        nodes {
          jsonData
        }
      }
      applicationMilestoneExcelDataByApplicationId(
        condition: { archivedAt: null }
      ) {
        nodes {
          jsonData
        }
      }
      applicationFormTemplate9DataByApplicationId {
        nodes {
          jsonData
          source
        }
      }
      conditionalApproval {
        jsonData
      }
      changeRequestDataByApplicationId {
        edges {
          node {
            id
          }
        }
      }
      applicationInternalNotesByApplicationId(
        condition: { archivedAt: null }
        first: 1
      ) {
        edges {
          node {
            id
            rowId
            note
          }
        }
      }
      status
      intakeNumber
    }
    # Cannot run it inside the above due to conflict of filter with header
    allApplicationSowData(
      filter: { applicationId: { equalTo: $rowId } }
      orderBy: AMENDMENT_NUMBER_DESC
      condition: { archivedAt: null }
    ) {
      nodes {
        amendmentNumber
        rowId
        jsonData
        sowTab1SBySowId {
          nodes {
            jsonData
            rowId
            sowId
          }
        }
        sowTab2SBySowId {
          nodes {
            rowId
            sowId
            jsonData
          }
        }
        sowTab7SBySowId {
          nodes {
            jsonData
            rowId
            sowId
          }
        }
        sowTab8SBySowId {
          nodes {
            rowId
            jsonData
            sowId
          }
        }
      }
    }
    allIntakes {
      nodes {
        closeTimestamp
        ccbcIntakeNumber
      }
    }
    allApplicationErs(filter: { applicationId: { equalTo: $rowId } }) {
      edges {
        node {
          applicationId
          ccbcNumber
          er
        }
      }
    }
    allApplicationRds(filter: { applicationId: { equalTo: $rowId } }) {
      edges {
        node {
          applicationId
          ccbcNumber
          rd
        }
      }
    }
    ...AnalystLayout_query
  }
`;

const StyledInfo = styled(Info)`
  color: ${(props) => props.theme.color.primaryBlue};
  float: right;
  cursor: pointer;
  padding-bottom: 2px;
`;

const StyledSummaryForm = styled(CbcForm)`
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

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledParagraph = styled('p')`
  margin-bottom: 0;
`;

const Summary = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, summaryQuery>) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const { section: toggledSection } = router.query;
  const showMap = useFeature('show_summary_map').value;
  const [mapData, setMapData] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(
    cookie.get('map_expanded') === 'true'
  );
  const query = usePreloadedQuery(getSummaryQuery, preloadedQuery);
  const {
    applicationByRowId,
    allApplicationSowData,
    allIntakes,
    allApplicationErs,
    allApplicationRds,
    session,
  } = query;
  const [toggleOverride, setToggleExpandOrCollapseAll] = useState<
    boolean | undefined
  >(true);
  const { formData, formDataSource, errors, fallBackFields } = generateFormData(
    applicationByRowId,
    allApplicationSowData,
    allIntakes,
    allApplicationErs,
    allApplicationRds
  );
  const [finalFormData, setFinalFormData] = useState<any>(formData);
  const [editMode, setEditMode] = useState(false);
  const { getMiscellaneousSchema } = useApplicationMerge();
  const { schema: miscSchema, uiSchema: miscUiSchema } = getMiscellaneousSchema(
    applicationByRowId,
    false,
    session?.authRole
  );

  // to handle dynamic titles and widgets based on the status
  const summaryReviewUiSchema = {
    ...reviewUiSchema,
    miscellaneous: miscUiSchema,
  };
  const summaryReviewSchema = {
    ...review,
    properties: {
      ...review.properties,
      miscellaneous: miscSchema,
    },
  };

  const finalUiSchema = {
    map: { ...mapUiSchema },
    ...summaryReviewUiSchema,
  };
  const finalSchema = {
    ...summaryReviewSchema,
    properties: {
      map: {
        required: map.required,
        title: map.title,
        properties: {
          ...map.properties,
        },
      },
      ...summaryReviewSchema.properties,
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      if (showMap) {
        const data = await fetch(`/api/map/${applicationId}`);
        const json = await data.json();
        setMapData(json);
        setFinalFormData({
          ...formData,
          map: { map: { json, setIsMapExpanded } },
        });
      } else {
        setFinalFormData(formData);
      }
    };

    fetchData();
  }, [applicationId, showMap, query]);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout
        query={query}
        mapData={mapData}
        isMapExpanded={isMapExpanded}
        setIsMapExpanded={setIsMapExpanded}
      >
        <>
          <h2>Summary</h2>
          {/* <MapCaller initialData={mapData} height="400px" width="600px" /> */}
          <StyledParagraph>
            This section provides up-to-date information on the project&apos;s
            status by pulling from the{' '}
            <StyledLink
              href={`/analyst/application/${applicationId}?expandAll=true`}
            >
              Application
            </StyledLink>
            ,{' '}
            <StyledLink
              href={`/analyst/application/${applicationId}/project?section=conditionalApproval`}
            >
              Conditional Approval
            </StyledLink>{' '}
            accordion, or{' '}
            <StyledLink
              href={`/analyst/application/${applicationId}/project?section=projectInformation`}
            >
              SOW
            </StyledLink>{' '}
            as it progresses through each stage.
          </StyledParagraph>
        </>
        <RightAlignText>
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
            <Tooltip
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  The fields on this page are read-only and display information
                  from the application, Conditional Approval, and SOW documents,
                  based on the application&apos;s status.
                </span>
              }
              placement="top"
            >
              <StyledInfo />
            </Tooltip>
          </>
        </RightAlignText>
        <StyledSummaryForm
          additionalContext={{
            toggleOverride,
            isCbc: false,
            isEditable: true,
            errors,
            editMode,
            formDataSource,
            showErrorHint: true,
            fallBackFields,
            toggledSection,
          }}
          formData={finalFormData}
          handleChange={() => {}}
          isExpanded
          isFormAnimated={false}
          isFormEditMode={editMode}
          title="Summary"
          theme={ReviewTheme}
          schema={isMapExpanded ? finalSchema : summaryReviewSchema}
          uiSchema={isMapExpanded ? finalUiSchema : summaryReviewUiSchema}
          resetFormData={() => {}}
          onSubmit={() => {}}
          setIsFormEditMode={setEditMode}
          saveBtnText="Save"
        />
      </AnalystLayout>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,

  variablesFromContext: (ctx) => {
    return {
      rowId: parseInt(ctx.query.applicationId.toString(), 10),
    };
  },
};

export default withRelay(Summary, getSummaryQuery, withRelayOptions);
