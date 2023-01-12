// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';

const sharedAssessmentTests = (testingHelper) => {
  it('should select radio options by default', () => {
    testingHelper.loadQuery();
    testingHelper.renderPage();

    const radioInput1 = screen.getByRole('radio', {
      name: 'root_nextStep-0',
    });

    const radioInput2 = screen.getByRole('radio', {
      name: 'root_decision-0',
    });

    expect(radioInput1).toBeChecked();
    expect(radioInput2).toBeChecked();
  });
};

// eslint-disable-next-line jest/no-export
export default sharedAssessmentTests;
