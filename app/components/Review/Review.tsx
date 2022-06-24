import Accordion from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import schema from '../../formSchema/schema';

import { OtherFundingSourcesTable, Table } from '.';

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

const Review = ({ formData }: Props) => {
  const formSchema = schema();
  const {
    additionalProjectInformation,
    alternateContact,
    authorizedContact,
    benefits,
    budgetDetails,
    estimatedProjectEmployment,
    existingNetworkCoverage,
    mapping,
    projectArea,
    contactInformation,
    organizationProfile,
    otherFundingSources,
    projectFunding,
    projectInformation,
    projectPlan,
    supportingDocuments,
    organizationLocation,
    techSolution,
    templateUploads,
  } = formData;

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
        return (
          <StyledAccordion
            key={subschema.title}
            title={subschema.title}
            defaultToggled
          >
            <Table formData={formData[section]} subschema={subschema} />
          </StyledAccordion>
        );
      })}
    </div>
  );
};

export default Review;
