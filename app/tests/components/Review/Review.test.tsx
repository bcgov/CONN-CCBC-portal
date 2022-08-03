import { Review } from '../../../components/Review';
import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  alternateContact,
  authorizedContact,
  benefits,
  budgetDetails,
  contactInformation,
  estimatedProjectEmployment,
  declarations,
  declarationsSign,
  existingNetworkCoverage,
  mapping,
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

import mockFormData from './mockFormData';
import mockFormErrorSchema from './mockFormErrorSchema';

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
    ...mapping,
    ...estimatedProjectEmployment,
    ...organizationProfile,
    ...organizationLocation,
    ...contactInformation,
    ...authorizedContact,
    ...alternateContact,
    ...review,
    ...declarations,
    ...declarationsSign,
  },
};

const renderStaticLayout = (errors: boolean) => {
  return render(
    <Review
      formData={mockFormData}
      formErrorSchema={mockFormErrorSchema}
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
    screen.getByRole('heading', { name: 'Mapping' });
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
      'Referring to the Project Zones shown in the application guide, which zone(s) will this Project be conducted in?'
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

describe('The Other funding sources section', () => {
  it('should have dynamically render array items', () => {
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
