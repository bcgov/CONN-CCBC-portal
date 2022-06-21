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
    geographicNames,
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

  const alternateContactSchema = formSchema.properties['alternateContact'];
  const authorizedContactSchema = formSchema.properties['authorizedContact'];
  const budgetDetailsSchema = formSchema.properties['budgetDetails'];
  const benefitsSchema = formSchema.properties['benefits'];
  const contactInformationSchema = formSchema.properties['contactInformation'];
  const existingNetworkCoverageSchema =
    formSchema.properties['existingNetworkCoverage'];
  const estimatedProjectEmploymentSchema =
    formSchema.properties['estimatedProjectEmployment'];
  const geographicNamesSchema = formSchema.properties['geographicNames'];
  const organizationProfileSchema =
    formSchema.properties['organizationProfile'];

  const organizationLocationSchema =
    formSchema.properties['organizationLocation'];
  const projectAreaSchema = formSchema.properties['projectArea'];
  const projectInformationSchema = formSchema.properties['projectInformation'];
  const projectFundingSchema = formSchema.properties['projectFunding'];
  const projectPlanSchema = formSchema.properties['projectPlan'];
  const supportingDocumentsSchema =
    formSchema.properties['supportingDocuments'];
  const techSolutionSchema = formSchema.properties['techSolution'];
  const templateUploadsSchema = formSchema.properties['templateUploads'];

  return (
    <div>
      <StyledAccordion title={projectInformationSchema.title} defaultToggled>
        <Table
          formData={projectInformation}
          subschema={projectInformationSchema}
        />
      </StyledAccordion>
      <StyledAccordion title={projectAreaSchema.title} defaultToggled>
        <Table formData={projectArea} subschema={projectAreaSchema} />
      </StyledAccordion>
      {/* <StyledAccordion title="Geographic names" defaultToggled>
        <Table formData={geographicNames} subschema={geographicNamesSchema} />
      </StyledAccordion> */}
      <StyledAccordion
        title={existingNetworkCoverageSchema.title}
        defaultToggled
      >
        <Table
          formData={existingNetworkCoverage}
          subschema={existingNetworkCoverageSchema}
        />
      </StyledAccordion>
      <StyledAccordion title={budgetDetailsSchema.title}>
        <Table formData={budgetDetails} subschema={budgetDetailsSchema} />
      </StyledAccordion>
      <StyledAccordion title={projectFundingSchema.title}>
        <Table formData={projectFunding} subschema={projectFundingSchema} />
      </StyledAccordion>
      <StyledAccordion title="Other funding sources">
        Content to display when toggled open.
      </StyledAccordion>
      <StyledAccordion title={techSolutionSchema.title}>
        <Table formData={techSolution} subschema={techSolutionSchema} />
      </StyledAccordion>
      <StyledAccordion title={benefitsSchema.title}>
        <Table formData={benefits} subschema={benefitsSchema} />
      </StyledAccordion>
      <StyledAccordion title={projectPlanSchema.title}>
        <Table formData={projectPlan} subschema={projectPlanSchema} />
      </StyledAccordion>
      <StyledAccordion title={estimatedProjectEmploymentSchema.title}>
        <Table
          formData={estimatedProjectEmployment}
          subschema={estimatedProjectEmploymentSchema}
        />
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
      <StyledAccordion title={organizationLocationSchema.title}>
        <Table
          formData={organizationLocation}
          subschema={organizationLocationSchema}
        />
      </StyledAccordion>
      <StyledAccordion title={contactInformationSchema.title}>
        <Table
          formData={contactInformation}
          subschema={contactInformationSchema}
        />
      </StyledAccordion>
      <StyledAccordion title={authorizedContactSchema.title}>
        <Table
          formData={authorizedContact}
          subschema={authorizedContactSchema}
        />
      </StyledAccordion>
      <StyledAccordion title={authorizedContactSchema.title}>
        <Table
          formData={authorizedContact}
          subschema={authorizedContactSchema}
        />
      </StyledAccordion>
    </div>
  );
};

export default Review;
