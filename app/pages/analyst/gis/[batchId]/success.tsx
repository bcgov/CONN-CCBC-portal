import { withRelay, RelayProps } from 'relay-nextjs';
import { graphql, usePreloadedQuery } from 'react-relay';
import defaultRelayOptions from 'lib/relay/withRelayOptions';
import { BatchIdQuery } from '__generated__/BatchIdQuery.graphql';
import { ButtonLink, Layout } from 'components';
import MetabaseLink from 'components/Analyst/Project/ProjectInformation/MetabaseLink';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import ToggleDropdown from 'components/ToggleDropdown';

interface StyledContainerProps {
  children?: React.ReactNode;
  marginTop?: string;
}

const StyledContainer = styled.div<StyledContainerProps>`
  margin-bottom: 5px;
  margin-top: ${(props) => props.marginTop || '5px'};
`;

interface StyledFlexProps {
  children?: React.ReactNode;
}

const StyledFlex = styled.div<StyledFlexProps>`
  display: flex;
  flex-direction: column;

  ${(props) => props.theme.breakpoint.extraLargeUp} {
    flex-direction: row;
  }
`;

interface StyledGreenCardProps {
  children?: React.ReactNode;
}

const StyledGreenCard = styled.div<StyledGreenCardProps>`
  align-items: center;
  padding: 8px 16px;
  width: 600px;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1em;
  margin-right: 2em;
  background-color: #dff0d8;
`;

interface StyledGrayCardProps {
  children?: React.ReactNode;
}

const StyledGrayCard = styled.div<StyledGrayCardProps>`
  align-items: center;
  padding: 8px 16px;
  width: 600px;
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1em;
  margin-right: 2em;
  background-color: #f1f2f3;
`;

interface StyledButtonProps {
  children?: React.ReactNode;
}

const StyledButton = styled.div<StyledButtonProps>`
  margin-top: 2em;
`;

const getGisUploadSuccessQuery = graphql`
  query successGisUploadQuery($batchId: Int!) {
    gisDataCounts(batchid: $batchId) {
      nodes {
        total
        countType
        ccbcNumbers
      }
    }
    session {
      ...DashboardTabs_query
      sub
    }
  }
`;

const BatchIdPage: React.FC<
  RelayProps<Record<string, unknown>, BatchIdQuery>
> = ({ preloadedQuery }) => {
  const { gisDataCounts, session } = usePreloadedQuery<BatchIdQuery>(
    getGisUploadSuccessQuery,
    preloadedQuery
  );

  return (
    <Layout session={session} title="Connecting Communities BC">
      <StyledFlex>
        <StyledContainer>
          <>
            <h1>GIS Analysis Import</h1>
            <StyledGreenCard>
              <StyledContainer>
                <FontAwesomeIcon icon={faCircleCheck} color="#2E8540" /> GIS
                analysis added to {gisDataCounts.nodes[0].total} projects for
                the first time
              </StyledContainer>
              <ToggleDropdown
                items={gisDataCounts.nodes[0]?.ccbcNumbers?.split(',') || []}
                hideText="Hide Projects"
                showText="View Projects"
              />
            </StyledGreenCard>
            <StyledGreenCard>
              <StyledContainer>
                <FontAwesomeIcon icon={faCircleCheck} color="#2E8540" /> GIS
                analysis updated for {gisDataCounts.nodes[1].total} projects
              </StyledContainer>
              <ToggleDropdown
                items={gisDataCounts.nodes[1]?.ccbcNumbers?.split(',') || []}
                hideText="Hide Projects"
                showText="View Projects"
              />
            </StyledGreenCard>
            <StyledGrayCard>
              <StyledContainer>
                GIS analysis unchanged for {gisDataCounts.nodes[3].total}{' '}
                projects and was not updated
              </StyledContainer>
              <ToggleDropdown
                items={gisDataCounts.nodes[3]?.ccbcNumbers?.split(',') || []}
                hideText="Hide Projects"
                showText="View Projects"
              />
            </StyledGrayCard>
            <StyledGrayCard>
              <StyledContainer>
                GIS analysis not imported for {gisDataCounts.nodes[4].total}{' '}
                projects because they are at or past Recommendation
              </StyledContainer>
              <ToggleDropdown
                items={gisDataCounts.nodes[4]?.ccbcNumbers?.split(',') || []}
                hideText="Hide Projects"
                showText="View Projects"
              />
            </StyledGrayCard>
            <StyledGrayCard>
              <StyledContainer>
                GIS analysis found for {gisDataCounts.nodes[2].total} CCBC
                numbers that are not in the portal
              </StyledContainer>
              <ToggleDropdown
                items={gisDataCounts.nodes[2]?.ccbcNumbers?.split(',') || []}
                hideText="Hide Projects"
                showText="View Projects"
              />
              <StyledContainer>
                Total processed {gisDataCounts.nodes[5].total}
              </StyledContainer>
            </StyledGrayCard>
            <StyledButton>
              <ButtonLink href="/analyst/dashboard">
                Return to dashboard
              </ButtonLink>
            </StyledButton>
          </>
        </StyledContainer>
        <StyledContainer marginTop="3.8em">
          <MetabaseLink
            href="https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/87-gis-analyses"
            text="Visit Metabase to view a dashboard of GIS analysis"
            testHref="https://ccbc-metabase.apps.silver.devops.gov.bc.ca/dashboard/91-gis-data-dashboard-test"
            width={600}
          />
        </StyledContainer>
      </StyledFlex>
    </Layout>
  );
};

export const withRelayOptions = {
  ...defaultRelayOptions,
  variablesFromContext: (ctx) => ({
    batchId: parseInt(ctx.query.batchId.toString(), 10),
  }),
};

export default withRelay(
  BatchIdPage,
  getGisUploadSuccessQuery,
  withRelayOptions
);
