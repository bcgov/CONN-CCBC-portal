import React from 'react';
import { render, screen } from '@testing-library/react';
import CbcStatusInformation from 'components/Analyst/CBC/CbcStatusInformation';
import GlobalTheme from 'styles/GlobalTheme';

const renderComponent = () => {
  return render(
    <GlobalTheme>
      <CbcStatusInformation />
    </GlobalTheme>
  );
};

describe('CbcStatusInformation', () => {
  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByText('Other Statuses')).toBeInTheDocument();
  });

  it('displays the lightbulb icon', () => {
    renderComponent();
    expect(screen.getByTestId('light-bulb-icon')).toBeInTheDocument();
  });

  it('displays the internal status description', () => {
    renderComponent();
    expect(
      screen.getByText(
        'The internal status for CBC projects mirrors the external status and changes in sync with external status. It was introduced to enhance dashboard filtering and usability.'
      )
    ).toBeInTheDocument();
  });

  it('displays the Withdrawn status chip', () => {
    renderComponent();
    expect(screen.getByText('Withdrawn')).toBeInTheDocument();
  });

  it('displays the Withdrawn status description', () => {
    renderComponent();
    expect(
      screen.getByText('Applicant has withdrawn their submitted application')
    ).toBeInTheDocument();
  });

  it('displays the Merged status chip', () => {
    renderComponent();
    expect(screen.getByText('Merged')).toBeInTheDocument();
  });

  it('displays the Merged status description', () => {
    renderComponent();
    expect(
      screen.getByText(
        "Application was combined with another project during negotiations and is now part of that 'Agreement Signed' project"
      )
    ).toBeInTheDocument();
  });

  it('renders the state machine image', () => {
    renderComponent();
    const image = screen.getByAltText(
      'The happy path for a project until its completion. The external status is the only status applicable to a CBC project. Once the project is in the Connectivity portal, it will start at Conditionally Approved. From there it can continue to Funding Agreement Signed, Agreement Signed, Final Report Delivered, and finally Reporting Complete.'
    );
    expect(image).toBeInTheDocument();
  });

  it('renders the image link with correct href', () => {
    renderComponent();
    const imageLink = screen
      .getByAltText(
        'The happy path for a project until its completion. The external status is the only status applicable to a CBC project. Once the project is in the Connectivity portal, it will start at Conditionally Approved. From there it can continue to Funding Agreement Signed, Agreement Signed, Final Report Delivered, and finally Reporting Complete.'
      )
      .closest('a');
    expect(imageLink).toHaveAttribute('href', '/images/cbcStateMachine.svg');
    expect(imageLink).toHaveAttribute('target', '_blank');
    expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
