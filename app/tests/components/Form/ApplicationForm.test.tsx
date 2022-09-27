import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockFormData from 'tests/utils/mockFormData';
import uiSchema from 'formSchema/uiSchema/uiSchema';
import crypto from 'crypto';

const testQuery = graphql`
  query ApplicationFormTestQuery @relay_test_operation {
    # Spread the fragment you want to test here
    application(id: "TestApplicationID") {
      ...ApplicationForm_application
    }

    query {
      ...ApplicationForm_query
    }
  }
`;

const mockQueryPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      formData: {},
      status: 'draft',
      updatedAt: '2022-09-12T14:04:10.790848-07:00',
    };
  },
  Query() {
    return {
      openIntake: {
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const mockQueryPayloadWithFormData = {
  ...mockQueryPayload,
  Application() {
    return {
      id: 'TestApplicationID',
      formData: mockFormData,
      status: 'draft',
    };
  },
};

const submissionPayload = {
  Application() {
    return {
      id: 'TestApplicationID',
      status: 'draft',
      updatedAt: '2022-09-12T14:04:10.790848-07:00',
      formData: {
        organizationProfile: {
          organizationName: 'Testing organization name',
        },
        submission: {
          submissionCompletedFor: 'test',
          submissionDate: '2022-09-27',
          submissionCompletedBy: 'test',
          submissionTitle: 'test',
        },
        acknowledgements: {
          acknowledgementsList: [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
          ],
        },
      },
    };
  },
  Query() {
    return {
      openIntake: {
        closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
      },
    };
  },
};

const componentTestingHelper =
  new ComponentTestingHelper<ApplicationFormTestQuery>({
    component: ApplicationForm,
    testQuery,
    compiledQuery,
    defaultQueryResolver: mockQueryPayload,
    getPropsFromTestQuery: (data) => ({
      application: data.application,
      pageNumber: 1,
      query: data.query,
    }),
  });

describe('The application form', () => {
  beforeEach(() => {
    componentTestingHelper.reinit();
  });

  it('saves the data as the user types', () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    fireEvent.change(screen.getByLabelText(/project title/i), {
      target: { value: 'test title' },
    });

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              projectInformation: {
                projectTitle: 'test title',
              },
              submission: {
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectInformation',
          },
          id: 'TestApplicationID',
        },
      }
    );
  });

  it('sets lastEditedPage to the next page when the user clicks on "continue"', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save and continue' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              projectInformation: {},
              submission: {
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectArea',
          },
          id: 'TestApplicationID',
        },
      }
    );
  });

  it('auto fills the submission fields', async () => {
    const mockQueryAutofillPayload = {
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {
            organizationProfile: {
              organizationName: 'Test org',
            },
          },
          status: 'draft',
          updatedAt: '2022-09-12T14:04:10.790848-07:00',
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockQueryAutofillPayload);
    componentTestingHelper.renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: 'Save and continue' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          applicationPatch: {
            formData: {
              organizationProfile: {
                organizationName: 'Test org',
              },
              projectInformation: {},
              submission: {
                submissionCompletedFor: 'Test org',
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'projectArea',
          },
          id: 'TestApplicationID',
        },
      }
    );
  });

  it('acknowledgement page continue is disabled on initial load', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    const continueButton = screen.getByRole('button', {
      name: 'Save and continue',
    });
    //node here is using the jest expect, whereas TS can only find the cypress jest
    expect(continueButton.hasAttribute('disabled')).toBeTrue();
  });

  it('acknowledgement page continue is enabled once all checkboxes have been clicked', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    const checkBoxes = screen.getAllByRole('checkbox');

    const lastCheckBox = checkBoxes.pop();

    checkBoxes.forEach(async (acknowledgement) => {
      await userEvent.click(acknowledgement);
    });

    userEvent.click(lastCheckBox).then(() => {
      waitFor(() => {
        expect(
          screen
            .getByRole('button', { name: 'Save and continue' })
            .hasAttribute('disabled')
        ).toBeFalse();
      });
    });
  });

  it('displays the correct button label for withdrawn applications', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'withdrawn',
          formData: {},
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:52:00.00000-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent();

    expect(screen.getByRole('button', { name: 'Continue' }));
  });

  it('submission page submit button is enabled on when all inputs filled', () => {
    componentTestingHelper.loadQuery(submissionPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
    ).toBeFalse();
  });

  it('submission page submit button is disabled on when all fields are not filled', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Submit' }).hasAttribute('disabled')
    ).toBeTrue();
  });

  it('waits for the mutations to be completed before redirecting to the success page', async () => {
    const formData = {
      submission: {
        submissionCompletedFor: 'Bob Loblaw',
        submissionDate: '2022-08-10',
        submissionCompletedBy: 'Bob Loblaw',
        submissionTitle: 'some title',
      },
      acknowledgements: {
        acknowledgementsList: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
        ],
      },
    };
    componentTestingHelper.loadQuery({
      Application() {
        return {
          id: 'TestApplicationID',
          rowId: 42,
          formData,
        };
      },
    });
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // After the first mutation completes, we still don't redirect
    expect(componentTestingHelper.router.push).not.toHaveBeenCalled();

    componentTestingHelper.expectMutationToBeCalled(
      'submitApplicationMutation',
      {
        input: {
          applicationRowId: 42,
        },
      }
    );

    componentTestingHelper.environment.mock.resolveMostRecentOperation({
      data: {
        applicationsAddCcbcId: {
          application: {
            ccbcNumber: 'CCBC-010042',
            status: 'submitted',
          },
        },
      },
    });

    // We only redirect when the ccbc id is set
    expect(componentTestingHelper.router.push).toHaveBeenCalledWith(
      '/form/42/success'
    );
  });

  it('Submission page contains submission date from DB', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByText(/August 27, 2022, 9:51:26 a.m. PDT/)
    ).toBeInTheDocument();
  });

  it('Acknowledgement fields are disabled when visiting submitted application', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'submitted',
          formData: {},
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    const checkBoxes = screen.getAllByRole('checkbox');

    checkBoxes.forEach((checkBox) => {
      expect(checkBox.hasAttribute('disabled')).toBeTrue();
    });
  });

  it('Submission fields are disabled when visiting submitted application', async () => {
    const payload = {
      Application() {
        return {
          id: 'TestApplicationID',
          status: 'submitted',
          formData: {},
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(payload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    const textBoxes = screen.getAllByRole('textbox');

    textBoxes.forEach((textBox) => {
      expect(textBox.hasAttribute('disabled')).toBeTrue();
    });
  });

  it('saves the form when the Save as draft button is clicked', async () => {
    componentTestingHelper.loadQuery();
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    await userEvent.click(
      screen.getByRole('button', { name: 'Save as draft' })
    );

    componentTestingHelper.expectMutationToBeCalled(
      'updateApplicationMutation',
      {
        input: {
          id: 'TestApplicationID',
          applicationPatch: {
            formData: {
              submission: {
                submissionDate: '2022-09-12',
              },
            },
            lastEditedPage: 'review',
          },
        },
      }
    );
  });

  it('acknowledgement page shows continue on submitted application', async () => {
    const mockSubmittedQueryPayload = {
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {},
          status: 'submitted',
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockSubmittedQueryPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 20,
      query: data.query,
    }));

    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
  });

  it('submit page submit button is disabled for submitted application', async () => {
    const mockSubmittedQueryPayload = {
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {},
          status: 'submitted',
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockSubmittedQueryPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Changes submitted' })
    ).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Changes submitted' })
        .hasAttribute('disabled')
    ).toBeTrue();
  });

  it('submit page has functioning return to dashboard button for submitted application', async () => {
    const mockSubmittedQueryPayload = {
      Application() {
        return {
          id: 'TestApplicationID',
          formData: {},
          status: 'submitted',
        };
      },
      Query() {
        return {
          openIntake: {
            closeTimestamp: '2022-08-27T12:51:26.69172-04:00',
          },
        };
      },
    };

    componentTestingHelper.loadQuery(mockSubmittedQueryPayload);
    componentTestingHelper.renderComponent((data) => ({
      application: data.application,
      pageNumber: 21,
      query: data.query,
    }));

    expect(
      screen.getByRole('button', { name: 'Return to dashboard' })
    ).toBeTruthy();
    await userEvent.click(
      screen.getByRole('button', { name: 'Return to dashboard' })
    );

    expect(componentTestingHelper.router.push).toHaveBeenCalledWith(
      '/dashboard'
    );
  });
  describe('the review page', () => {
    beforeAll(() => {
      // Some rjsf features require window.crypto, which isn't provided by jsdom
      Object.defineProperty(global.self, 'crypto', {
        value: {
          getRandomValues: (arr) => crypto.randomBytes(arr.length),
        },
      });
    });
    const REVIEW_PAGE_INDEX =
      uiSchema['ui:order'].findIndex((e) => e === 'review') + 1;

    it('should have correct sections', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

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

    it('should have correct heading styles', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));
      const heading = screen.getByRole('heading', {
        name: 'Project information',
      });

      const style = window.getComputedStyle(heading);

      expect(style.fontSize).toBe('24px');
      expect(style.marginBottom).toBe('0px');
    });

    it('should have correct subheading styles', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));
      const subheading = screen.getAllByText(
        'Amount requested under source:'
      )[0];

      const style = window.getComputedStyle(subheading);

      expect(style.fontSize).toBe('14px');
      expect(style.fontWeight).toBe('600');
      expect(style.padding).toBe('16px');
      expect(style.margin).toBe('0px');
    });

    it('should have the correct fields in the Project Area section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen.getByRole('heading', { name: 'Project area' }).closest('section')
      );

      expect(
        section
          .getByText(/which zone\(s\) will this project be conducted in\?/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('1');

      expect(
        section
          .getByText(
            /Does your Project span multiple provinces\/territories\?/i
          )
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/yes/i);

      expect(
        section
          .getByText(/select the provinces or territories/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/Alberta,Northwest Territories/i);
    });

    it('should have correct fields in the budget details section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Budget details' })
          .closest('section')
      );

      expect(
        section
          .getByText(/Total project cost/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$1 230');

      expect(
        section
          .getByText(/Total eligible cost/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$1 000');
    });

    it('should display headings in the estimated employment', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Estimated project employment' })
          .closest('section')
      );

      expect(
        section.getByText('Estimated direct employees')
      ).toBeInTheDocument();
      expect(
        section.getByText('Estimated contractor labour')
      ).toBeInTheDocument();
    });

    it('should display empty red fields in the budget details section when there are errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Budget details' })
          .closest('section')
      );

      const errorCell = section
        .getByText('Total project cost (Template 2 - cell H28)')
        .closest('tr')
        .getElementsByTagName('td')[0];

      expect(errorCell).toBeEmptyDOMElement();
      expect(errorCell).toHaveStyle(
        'background-color: rgba(248, 214, 203, 0.4)'
      );
    });

    it('should have correct fields in the Existing network coverage section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Existing network coverage' })
          .closest('section')
      );

      expect(
        section
          .getByText(/Does the Applicant own Passive Infrastructure/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/yes/i);
    });

    it('should have correct fields in the Project funding  section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        document.getElementById('root_projectFunding_fundingRequestedCCBC2223')
      ).toHaveTextContent(`2022-23`);

      expect(
        document.getElementById('root_projectFunding_fundingRequestedCCBC2324')
      ).toHaveTextContent(`2023-24`);

      expect(
        document.getElementById('root_projectFunding_fundingRequestedCCBC2425')
      ).toHaveTextContent(`2024-25`);

      expect(
        document.getElementById('root_projectFunding_fundingRequestedCCBC2526')
      ).toHaveTextContent(`2025-26`);

      expect(
        document.getElementById('root_projectFunding_fundingRequestedCCBC2627')
      ).toHaveTextContent(`2026-27`);

      expect(
        document.getElementById('root_projectFunding_totalFundingRequestedCCBC')
      ).toHaveTextContent(`Total amount requested under CCBC`);

      expect(
        document.getElementById(
          'root_projectFunding_applicationContribution2223'
        )
      ).toHaveTextContent(`2022-23`);

      expect(
        document.getElementById(
          'root_projectFunding_applicationContribution2324'
        )
      ).toHaveTextContent(`2023-24`);

      expect(
        document.getElementById(
          'root_projectFunding_applicationContribution2425'
        )
      ).toHaveTextContent(`2024-25`);

      expect(
        document.getElementById(
          'root_projectFunding_applicationContribution2526'
        )
      ).toHaveTextContent(`2025-26`);

      expect(
        document.getElementById(
          'root_projectFunding_applicationContribution2627'
        )
      ).toHaveTextContent(`2026-27`);

      expect(
        document.getElementById(
          'root_projectFunding_totalApplicantContribution'
        )
      ).toHaveTextContent(`Total amount Applicant will contribute`);
    });

    it('should have correct fields in The Technological solution section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: /Technological solution/i })
          .closest('section')
      );

      expect(
        section
          .getByText(/System design/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('design of system');

      expect(
        section
          .getByText(/Scalability/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('much scalable');

      expect(
        section
          .getByText(/backbone technology/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('Fibre,Satellite');

      expect(
        section
          .getByText(/last mile technology/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('Fibre,Fixed wireless');
    });

    it('should have correct fields in The Project planning section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: /Project planning/i })
          .closest('section')
      );

      expect(
        section
          .getByText('Project Start Date (YYYY/MM/DD)')
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('2022-06-10');
    });

    it('should have correct fields in The Other funding sources section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Other funding sources' })
          .closest('section')
      );

      expect(
        section
          .getAllByText('2022-23')[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$1');

      expect(
        section
          .getAllByText('2023-24')[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$2');

      expect(
        section
          .getAllByText('2024-25')[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$3');

      expect(
        section
          .getAllByText('2025-26')[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$4');

      expect(
        section
          .getAllByText('2026-27')[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$5');

      expect(
        section
          .getByText(
            /Total amount requested under Canadian Infrastructure Bank/i
          )
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent('$15');
    });

    it('should the correct fields in the Organization location section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      const section = within(
        screen
          .getByRole('heading', { name: 'Organization location' })
          .closest('section')
      );

      expect(
        section
          .getAllByText(/city/i)[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/victoria/i);

      expect(
        section
          .getAllByText(/unit number/i)[0]
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/1231231/i);

      expect(
        section
          .getByText(/Is the mailing address the same as above/i)
          .closest('tr')
          .getElementsByTagName('td')[0]
      ).toHaveTextContent(/no/i);
    });

    it('should have the correct field and value in the Organization profile section', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(document.getElementById('bandNumber-error')).toBeNull();
    });

    it('should not display alert box without errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(screen.getByText('All fields are complete')).toBeInTheDocument();
    });

    it('should display the alert box when there are errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByText(
          'There are empty fields in your application. Applications with unanswered fields may not be assessed.'
        )
      ).toBeInTheDocument();
    });

    it('allows continuing to the next page if there are no errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeEnabled();
    });

    it('prevents submission if errors are not acknowledged', async () => {
      componentTestingHelper.loadQuery(mockQueryPayload);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeDisabled();

      await userEvent.click(
        screen.getByLabelText(
          /you acknowledge that there are incomplete fields and incomplete applications may not be assessed/i
        )
      );

      expect(
        screen.getByRole('button', { name: /save and continue/i })
      ).toBeEnabled();
    });

    it('does not show the incomplete fields acknowledgment checkbox if there are no errors', () => {
      componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
      componentTestingHelper.renderComponent((data) => ({
        application: data.application,
        pageNumber: REVIEW_PAGE_INDEX,
        query: data.query,
      }));

      expect(
        screen.queryByLabelText(
          /you acknowledge that there are incomplete fields and incomplete applications may not be assessed/i
        )
      ).toBeNull();
    });
  });
});
