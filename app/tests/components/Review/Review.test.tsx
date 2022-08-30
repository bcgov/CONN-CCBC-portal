import { Review } from '../../../components/Review';
import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  coverage,
  estimatedProjectEmployment,
  existingNetworkCoverage,
  organizationLocation,
  organizationProfile,
  otherFundingSources,
  projectArea,
  projectInformation,
  projectFunding,
  projectPlan,
  supportingDocuments,
  review,
  techSolution,
  templateUploads,
} from '../../../formSchema/pages';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2131
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validateFormData from '@rjsf/core/dist/cjs/validate';
import mockFormData from './mockFormData';

// This can be removed and directly imported once GrowthBook feature flagging is removed from form schema
const schema = {
  type: 'object',
  properties: {
    ...projectInformation,
    ...projectArea,
    ...existingNetworkCoverage,
    ...budgetDetails,
    ...projectFunding,
    ...otherFundingSources,
    ...techSolution,
    ...benefits,
    ...projectPlan,
    ...templateUploads,
    ...supportingDocuments,
    ...coverage,
    ...estimatedProjectEmployment,
    ...organizationProfile,
    ...organizationLocation,
    ...contactInformation,
    ...authorizedContact,
    ...alternateContact,
    ...review,
  },
};

const errorSchema = validateFormData(mockFormData, schema)?.errorSchema;

const renderStaticLayout = (errors: boolean) => {
  return render(
    <Review
      formData={mockFormData}
      formErrorSchema={errorSchema}
      formSchema={schema}
      noErrors={!errors}
      onReviewConfirm={() => console.log('e')}
      reviewConfirm={true}
    />
  );
};

describe('The Review component', () => {
  it('should have correct sections', () => {
    const errors = false;
    renderStaticLayout(errors);
    screen.getByRole('heading', { name: 'Project information' });
    screen.getByRole('heading', { name: 'Project area' });
    screen.getByRole('heading', { name: 'Existing network coverage' });
    screen.getByRole('heading', { name: 'Budget details' });
    screen.getByRole('heading', { name: 'Project funding' });
    screen.getByRole('heading', { name: 'Other funding sources' });
    screen.getByRole('heading', { name: 'Technological solution' });
    screen.getByRole('heading', { name: 'Benefits' });
    screen.getByRole('heading', { name: 'Project planning and management' });
    screen.getByRole('heading', { name: 'Estimated project employment' });
    screen.getByRole('heading', { name: 'Template uploads' });
    screen.getByRole('heading', { name: 'Supporting documents' });
    screen.getByRole('heading', { name: 'Coverage' });
    screen.getByRole('heading', { name: 'Organization profile' });
    screen.getByRole('heading', { name: 'Organization location' });
    screen.getByRole('heading', { name: 'Organization contact information' });
  });
});

describe('The Review component sections', () => {
  it('should have correct heading styles', () => {
    const errors = false;
    renderStaticLayout(errors);
    const heading = screen.getByRole('heading', {
      name: 'Project information',
    });

    const style = window.getComputedStyle(heading);

    expect(style.fontSize).toBe('24px');
    expect(style.marginBottom).toBe('0px');
  });

  it('should have correct subheading styles', () => {
    const errors = false;
    renderStaticLayout(errors);
    const subheading = screen.getAllByText('Amount requested under source:')[0];

    const style = window.getComputedStyle(subheading);

    expect(style.fontSize).toBe('14px');
    expect(style.fontWeight).toBe('600');
    expect(style.padding).toBe('16px');
    expect(style.margin).toBe('0px');
  });
});

describe('The Project area section', () => {
  it('should have correct fields', () => {
    const errors = true;
    renderStaticLayout(errors);

    expect(document.getElementById('geographicArea')).toHaveTextContent(
      'Referring to the project zones (application guide Annex 6), which zone(s) will this project be conducted in?'
    );

    expect(
      document.getElementById('projectSpanMultipleLocations')
    ).toHaveTextContent(
      'Does your Project span multiple provinces/territories?'
    );

    expect(
      document.getElementById('provincesTerritories-value')
    ).toHaveTextContent(`Alberta`);
  });
});

describe('The Budget details section without errors', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('totalProjectCost')).toHaveTextContent(
      'Total project cost (Template 2 - cell H28)'
    );

    expect(document.getElementById('totalProjectCost-value')).toHaveTextContent(
      '$1 231 231 231 231'
    );
  });
});

describe('The Budget details section with errors', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('totalProjectCost')).toHaveTextContent(
      'Total project cost (Template 2 - cell H28)'
    );

    expect(document.getElementById('totalProjectCost-error')).toBeNull();
  });
});

describe('The Existing network coverage section', () => {
  it('should have correct section description', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(
      document.getElementById('hasPassiveInfrastructure')
    ).toHaveTextContent(
      `Does the Applicant own Passive Infrastructure (including, for example, towers, poles, rights of way or other similar assets and infrastructure)?`
    );
  });
});

describe('The Project funding  section', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(
      document.getElementById('fundingRequestedCCBC2223')
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById('fundingRequestedCCBC2324')
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById('fundingRequestedCCBC2425')
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById('fundingRequestedCCBC2526')
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById('fundingRequestedCCBC2627')
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById('totalFundingRequestedCCBC')
    ).toHaveTextContent(`Total amount requested under CCBC`);

    expect(
      document.getElementById('applicationContribution2223')
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById('applicationContribution2324')
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById('applicationContribution2425')
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById('applicationContribution2526')
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById('applicationContribution2627')
    ).toHaveTextContent(`2026-27`);

    expect(
      document.getElementById('totalApplicantContribution')
    ).toHaveTextContent(`Total amount Applicant will contribute`);

    expect(
      document.getElementById('infrastructureBankFunding2223')
    ).toHaveTextContent(`2022-23`);

    expect(
      document.getElementById('infrastructureBankFunding2324')
    ).toHaveTextContent(`2023-24`);

    expect(
      document.getElementById('infrastructureBankFunding2425')
    ).toHaveTextContent(`2024-25`);

    expect(
      document.getElementById('infrastructureBankFunding2526')
    ).toHaveTextContent(`2025-26`);

    expect(
      document.getElementById('totalInfrastructureBankFunding')
    ).toHaveTextContent(
      `Total amount requested under Canadian Infrastructure Bank`
    );
  });
});

describe('The Technological solution section', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('systemDesign')).toHaveTextContent(
      `System design: Provide a description of the system design which covers all key Network components that will enable improved connectivity. This description should provide sufficient detail, from the start to the end points.`
    );

    expect(document.getElementById('scalability')).toHaveTextContent(
      `Scalability: Describe the ability of the Network to adapt to forecasted increased Network capacity and demand over the next 5 years from the Project Completion Date, accommodating additional subscribers and usage traffic, enhanced services and the Network’s ability to support speeds identified in the application guide.`
    );

    expect(document.getElementById('backboneTechnology')).toHaveTextContent(
      `Please specify the backbone technology type (check all that apply).`
    );

    expect(document.getElementById('lastMileTechnology')).toHaveTextContent(
      `Please specify the last mile technology type (check all that apply). If you select fixed wireless, you must complete Template 7.`
    );
  });
});

describe('The Project planning section', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('projectStartDate')).toHaveTextContent(
      `Project Start Date (YYYY/MM/DD)`
    );
  });
});

describe('The Other funding sources section', () => {
  it('should have correct fields', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('fundingPartnersName')).toHaveTextContent(
      `Funding partner's name`
    );
  });
});

describe('The Organization location section without errors', () => {
  it('should have dynamically render mailing address', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('city-value')).toHaveTextContent('Victoria');

    expect(document.getElementById('unitNumberMailing')).toHaveTextContent(
      'Unit number'
    );

    expect(document.getElementById('isMailingAddress-value')).toHaveTextContent(
      'No'
    );

    expect(document.getElementById('organizationLocation')).toHaveTextContent(
      'Mailing address:'
    );
  });
});

describe('The Organization profile section with errors', () => {
  it('should have the correct field and value', () => {
    const errors = true;
    renderStaticLayout(errors);

    expect(document.getElementById('bandNumber-error')).toBeNull();
  });
});

describe('The alert box without errors', () => {
  it('should have the correct value', () => {
    const errors = false;
    renderStaticLayout(errors);

    expect(document.getElementById('review-alert')).toHaveTextContent(
      'All fields are complete'
    );
  });
});

describe('The alert box with errors', () => {
  it('should have the correct value', () => {
    const errors = true;
    renderStaticLayout(errors);

    expect(document.getElementById('review-alert')).toHaveTextContent(
      'There are empty fields in your application. Applications with unanswered fields may not be assessed.'
    );
  });
});

describe('The Review component with no form data and', () => {
  it('should have the correct value', () => {
    const errors = true;
    render(
      <Review
        formData={{}}
        formErrorSchema={validateFormData({}, schema)?.errorSchema}
        formSchema={schema}
        noErrors={!errors}
        onReviewConfirm={() => console.log('e')}
        reviewConfirm={true}
      />
    );

    expect(document.getElementById('review-alert')).toHaveTextContent(
      'There are empty fields in your application. Applications with unanswered fields may not be assessed.'
    );

    expect(document.getElementById('projectTitle-error')).toBeInTheDocument();

    expect(
      document.getElementById('geographicAreaDescription-error')
    ).toBeInTheDocument();

    expect(
      document.getElementById('hoursOfContractorEmploymentPerWeek-error')
    ).toBeInTheDocument();

    expect(
      document.getElementById('totalEligibleCosts-error')
    ).toBeInTheDocument();

    expect(
      document.getElementById('totalFundingRequestedCCBC-error')
    ).toBeInTheDocument();

    expect(document.getElementById('systemDesign-error')).toBeInTheDocument();

    expect(
      document.getElementById('projectBenefits-error')
    ).toBeInTheDocument();
  });
});
