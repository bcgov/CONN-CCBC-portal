import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { graphql } from 'react-relay';
import { withRelay, RelayProps } from 'relay-nextjs';
import { usePreloadedQuery } from 'react-relay/hooks';
import Layout from 'components/Layout';
import AnalystLayout from 'components/Analyst/AnalystLayout';
import { summaryQuery } from '__generated__/summaryQuery.graphql';
import CbcForm from 'components/Analyst/CBC/CbcForm';
import ReviewTheme from 'components/Review/ReviewTheme';
import reviewUiSchema from 'formSchema/uiSchema/summary/reviewUiSchema';
import review from 'formSchema/analyst/summary/review';
import styled from 'styled-components';
import { Tooltip } from '@mui/material';
import { Info } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import generateFormData from 'lib/helpers/ccbcSummaryGenerateFormData';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MapCaller from 'components/Analyst/Map/MapCaller';

const getSummaryQuery = graphql`
  query summaryQuery($rowId: Int!) {
    session {
      sub
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
      applicationStatusesByApplicationId(
        filter: { status: { equalTo: "submitted" } }
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
      status
      intakeNumber
    }
    # Cannot run it inside the above due to conflict of filter with header
    allApplicationSowData(
      filter: { applicationId: { equalTo: $rowId } }
      condition: { archivedAt: null }
      last: 1
    ) {
      nodes {
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

const Summary = ({
  preloadedQuery,
}: RelayProps<Record<string, unknown>, summaryQuery>) => {
  const router = useRouter();
  const applicationId = router.query.applicationId as string;
  const [mapData, setMapData] = useState(null);
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
  const { formData, formDataSource, errors } = generateFormData(
    applicationByRowId,
    allApplicationSowData,
    allIntakes,
    allApplicationErs,
    allApplicationRds
  );
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/map/${applicationId}`);
      setMapData(await data.json());
    };

    fetchData();
  }, [applicationId]);

  return (
    <Layout session={session} title="Connecting Communities BC">
      <AnalystLayout query={query}>
        <>
          <h2>Summary</h2>
          <MapCaller initialData={mapData} />
          <p>
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
          </p>{' '}
          <br />
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
            isEditable: false,
            errors,
            formDataSource,
            showErrorHint: true,
          }}
          formData={formData}
          handleChange={() => {}}
          isExpanded
          isFormAnimated={false}
          isFormEditMode={false}
          title="Summary"
          theme={ReviewTheme}
          schema={review}
          uiSchema={reviewUiSchema}
          resetFormData={() => {}}
          onSubmit={() => {}}
          setIsFormEditMode={() => {}}
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
