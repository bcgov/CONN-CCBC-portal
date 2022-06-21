import Accordion from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import schema from '../../formSchema/schema';

import { Table } from '.';
type Props = {
  formData: any;
  sectionSchema: any;
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

const Review = ({ formData, sectionSchema }: Props) => {
  const formSchema = schema();
  const {
    additionalProjectInformation,
    alternateContact,
    authorizedContact,
    benefits,
    budgetDetails,
    declarations,
    declarationsSign,
    estimatedProjectEmployment,
    existingNetworkCoverage,
    projectArea,
    contactInformation,
    organizationProfile,
    projectFunding,
    projectInformation,
    projectPlan,
    supportingDocuments,
    organizationLocation,
    techSolution,
    templateUploads,
  } = formData;

  const existingNetworkCoverageSchema =
    formSchema.properties['existingNetworkCoverage'];
  const organizationProfileSchema =
    formSchema.properties['organizationProfile'];

  const projectInformationSchema = formSchema.properties['projectInformation'];
  const supportingDocumentsSchema =
    formSchema.properties['supportingDocuments'];
  return (
    <div>
      <StyledAccordion title={projectInformationSchema.title} defaultToggled>
        <Table
          formData={projectInformation}
          subschema={projectInformationSchema}
        />
      </StyledAccordion>
      <StyledAccordion title="Project area" defaultToggled>
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Geographic names" defaultToggled>
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion
        title={existingNetworkCoverageSchema.title}
        defaultToggled
      >
        <Table
          formData={existingNetworkCoverage}
          subschema={existingNetworkCoverageSchema}
        />
      </StyledAccordion>
      <StyledAccordion title="Budget details">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Project funding">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Other funding sources">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Technological solution">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Benefits">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Project planning and management">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Estimated project employment">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Template uploads">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Supporting documents" defaultToggled>
        {/* <Table
          formData={supportingDocuments}
          subschema={supportingDocumentsSchema}
        /> */}
      </StyledAccordion>
      <StyledAccordion title="Mapping">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Organization profile" defaultToggled>
        <Table
          formData={organizationProfile}
          subschema={organizationProfileSchema}
        />
      </StyledAccordion>
      <StyledAccordion title="Organization location">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Organization contact information">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Authorized contact">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title="Alternate contact">
        Content to display when toggled open.
      </StyledAccordion>
    </div>
  );
};

export default Review;
