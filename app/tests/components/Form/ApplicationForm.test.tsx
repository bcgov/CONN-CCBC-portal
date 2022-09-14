import ApplicationForm from 'components/Form/ApplicationForm';
import { graphql } from 'react-relay';
import ComponentTestingHelper from '../../utils/componentTestingHelper';
import compiledQuery, {
  ApplicationFormTestQuery,
} from '__generated__/ApplicationFormTestQuery.graphql';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockFormData from 'tests/utils/mockFormData';
import uiSchema from 'formSchema/uiSchema/uiSchema';

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
  it.todo('prevents submission if errors are not acknowledged');
  describe('the review page', () => {
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

    describe('The Review component sections', () => {
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
    });

    describe.only('The Project area section', () => {
      it.only('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(
          screen
            .getByText(/which zone\(s\) will this project be conducted in\?/i)
            .closest('tr')
            .getElementsByTagName('td')[0]
        ).toHaveTextContent('1');

        expect(
          screen
            .getByText(
              /Does your Project span multiple provinces\/territories\?/i
            )
            .closest('tr')
            .getElementsByTagName('td')[0]
        ).toHaveTextContent(/yes/i);

        expect(
          screen
            .getByText(/select the provinces or territories\?/i)
            .closest('tr')
            .getElementsByTagName('td')[0]
        ).toHaveTextContent(/Alberta.*Northwest Territories/i);
      });
    });

    describe('The Budget details section without errors', () => {
      it('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(
          screen
            .getByText('Total project cost (Template 2 - cell H28)')
            .closest('tr')
            .getElementsByTagName('td')[0]
        ).toHaveTextContent('$1 231 231 231 231');
      });
    });

    describe.only('The Budget details section with errors', () => {
      it.only('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        const errorCell = screen
          .getByText('Total project cost (Template 2 - cell H28)')
          .closest('tr')
          .getElementsByTagName('td')[0];

        expect(window.getComputedStyle(errorCell).color).toBe('');

        expect(document.getElementById('totalProjectCost-error')).toBeNull();
      });
    });

    describe('The Existing network coverage section', () => {
      it('should have correct section description', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));
        expect(
          document.getElementById('hasPassiveInfrastructure')
        ).toHaveTextContent(
          `Does the Applicant own Passive Infrastructure (including, for example, towers, poles, rights of way or other similar assets and infrastructure)?`
        );
      });
    });

    describe('The Project funding  section', () => {
      it('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(
          document.getElementById(
            'root_projectFunding_fundingRequestedCCBC2223'
          )
        ).toHaveTextContent(`2022-23`);

        expect(
          document.getElementById(
            'root_projectFunding_fundingRequestedCCBC2324'
          )
        ).toHaveTextContent(`2023-24`);

        expect(
          document.getElementById(
            'root_projectFunding_fundingRequestedCCBC2425'
          )
        ).toHaveTextContent(`2024-25`);

        expect(
          document.getElementById(
            'root_projectFunding_fundingRequestedCCBC2526'
          )
        ).toHaveTextContent(`2025-26`);

        expect(
          document.getElementById(
            'root_projectFunding_fundingRequestedCCBC2627'
          )
        ).toHaveTextContent(`2026-27`);

        expect(
          document.getElementById(
            'root_projectFunding_totalFundingRequestedCCBC'
          )
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
    });

    describe('The Technological solution section', () => {
      it('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));
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
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(document.getElementById('projectStartDate')).toHaveTextContent(
          `Project Start Date (YYYY/MM/DD)`
        );
      });
    });

    describe('The Other funding sources section', () => {
      it('should have correct fields', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

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

        expect(
          document.getElementById('fundingPartnersName')
        ).toHaveTextContent(`Funding partner's name`);
      });
    });

    describe('The Organization location section without errors', () => {
      it('should have dynamically render mailing address', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(document.getElementById('city-value')).toHaveTextContent(
          'Victoria'
        );

        expect(document.getElementById('unitNumberMailing')).toHaveTextContent(
          'Unit number'
        );

        expect(
          document.getElementById('isMailingAddress-value')
        ).toHaveTextContent('No');

        expect(
          document.getElementById('organizationLocation')
        ).toHaveTextContent('Mailing address:');
      });
    });

    describe('The Organization profile section with errors', () => {
      it('should have the correct field and value', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(document.getElementById('bandNumber-error')).toBeNull();
      });
    });

    describe('The alert box without errors', () => {
      it('should have the correct value', () => {
        componentTestingHelper.loadQuery(mockQueryPayloadWithFormData);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(document.getElementById('review-alert')).toHaveTextContent(
          'All fields are complete'
        );
      });
    });

    describe('The alert box with errors', () => {
      it('should have the correct value', () => {
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
    });

    describe.skip('The Review component with no form data', () => {
      it('should have the correct value', () => {
        componentTestingHelper.loadQuery(mockQueryPayload);
        componentTestingHelper.renderComponent((data) => ({
          application: data.application,
          pageNumber: REVIEW_PAGE_INDEX,
          query: data.query,
        }));

        expect(document.getElementById('review-alert')).toHaveTextContent(
          'There are empty fields in your application. Applications with unanswered fields may not be assessed.'
        );

        expect(
          screen.getByTestId('root_projectInformation_projectTitle-error')
        ).toBeInTheDocument();

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

        expect(
          document.getElementById('systemDesign-error')
        ).toBeInTheDocument();

        expect(
          document.getElementById('projectBenefits-error')
        ).toBeInTheDocument();
      });
    });
    it.todo('prevents submission if errors are not acknowledged');
  });
});
