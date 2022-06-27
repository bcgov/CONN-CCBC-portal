import Accordion from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import schema from '../../formSchema/schema';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';

import {
  OtherFundingSourcesTable,
  ProjectAreaTable,
  ProjectFundingTable,
  Table,
} from '.';

type Props = {
  formData: any;
};

const StyledAccordion = styled(Accordion)`
  h2 {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  svg {
    width: 20px;
    height: 20px;
    vertical-align: 0;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledCheckboxLabel = styled('label')`
  padding-left: 1em;
`;

const StyledCheckboxDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0;

  & span {
    border-radius: 2px;
  }

  & label {
    padding-left: 1em;
  }
`;

const Review = ({ formData }: Props) => {
  const formSchema = schema();

  const reviewSchema = [
    'projectInformation',
    'projectArea',
    'existingNetworkCoverage',
    'budgetDetails',
    'projectFunding',
    'otherFundingSources',
    'techSolution',
    'benefits',
    'projectPlan',
    'estimatedProjectEmployment',
    'templateUploads',
    'supportingDocuments',
    'mapping',
    'organizationProfile',
    'organizationLocation',
    'contactInformation',
    'alternateContact',
    'authorizedContact',
  ];

  return (
    <div>
      {reviewSchema.map((section) => {
        const subschema = formSchema.properties[section];
        const customTable =
          section === 'otherFundingSources' ||
          section === 'projectFunding' ||
          section === 'projectArea';

        return (
          <StyledAccordion
            key={subschema.title}
            title={subschema.title}
            defaultToggled
          >
            {!customTable && (
              <Table formData={formData[section]} subschema={subschema} />
            )}

            {section === 'otherFundingSources' && (
              <OtherFundingSourcesTable
                formData={formData[section].otherFundingSourcesArray}
                subschema={subschema}
              />
            )}

            {section === 'projectFunding' && (
              <ProjectFundingTable
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'projectArea' && (
              <ProjectAreaTable
                formData={formData[section]}
                subschema={subschema}
              />
            )}
          </StyledAccordion>
        );
      })}
      <StyledCheckboxDiv>
        <Checkbox id="review-confirmation-checkbox" />
        <StyledCheckboxLabel htmlFor="review-confirmation-checkbox">
          The Applicant acknowledges that there are unanswered fields and
          incomplete applications may not be assessed.
        </StyledCheckboxLabel>
      </StyledCheckboxDiv>
    </div>
  );
};

export default Review;
