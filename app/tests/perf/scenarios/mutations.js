/* eslint-disable */
import http from 'k6/http';
import { check } from 'k6';

const mutations = () => {
  const postParams = {
    cookies: {
      'mocks.auth_role': 'ccbc_auth_user',
      'mocks.mocked_timestamp': 1660924800,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const createApplicationPayload = JSON.stringify({
    id: 'createApplicationMutation',
    query: `
      mutation createApplicationMutation($input: CreateApplicationInput!) {
        createApplication(input: $input) {
          application {
            rowId
            formData {
              rowId
            }
          }
        }
      }`,
    variables: { input: {} },
  });

  const res = http.post(
    __ENV.APP_HOST + '/graphql',
    createApplicationPayload,
    Object.assign({}, postParams, {
      tags: { name: 'createApplicationMutation' },
    })
  );

  const responseData = res.json().data;
  const formDataRowId =
    responseData.createApplication.application.formData.rowId;
  const applicationRowId = responseData.createApplication.application.rowId;

  const updateApplicationPayload = JSON.stringify({
    id: 'updateApplicationFormMutation',
    query: `
      mutation updateApplicationFormMutation($input: UpdateApplicationFormInput!) {
        updateApplicationForm(input: $input) {
          formData {
            id
            jsonData
            updatedAt
          }
        }
      }`,

    variables: {
      input: {
        jsonData: {
          projectInformation: { projectTitle: 'test' },
          acknowledgements: {
            acknowledgementsList: [
              `The Applicant acknowledges that it is under no obligation or prohibition, nor is it subject to, or threatened by any actions, suits or proceedings, which could or would affect its ability to implement this proposed Project.`,
              `The Applicant acknowledges that the Program may collect and share Applicant information for purposes that include making enquiries of such persons, firms, corporations, federal and provincial government agencies/departments/ministries, and non-profit organizations as the Program deems necessary in order to reach a decision on this proposed project.`,
              `The Applicant acknowledges that any person, who is required to be registered pursuant to the Lobbyists Transparency Act (British Columbia) or the Lobbying Act (Canada), including consultant and in-house lobbyists, must be registered pursuant to, and comply with, those Acts as applicable.`,
              `The Applicant acknowledges that, where applicable, the Project may require an assessment under the Impact Assessment Act (Canada) or the Environmental Assessment Act (British Columbia).`,
              `The Applicant recognizes that there is a duty to consult Indigenous groups if a funded Project may undertake infrastructure in, or affecting, an Indigenous community, and the Applicant understands that it must provide such information and assistance to the Province or Federal government in connection with such consultation as may reasonably be required, including, but not limited to, those obligations with respect to Indigenous consultation which may be set forth in any Funding Agreement.`,
              `The Applicant acknowledges that any current or former public officer holder or public servant employed by the Applicant must comply with the provisions of the Standards of Conduct for BC Public Service employees, the Disclosing a Conflict of Interest: Employee Guideline & Disclosure Form (British Columbia), the Members’ Conflict of Interest Act (British Columbia), the Values and Ethics Code for the Public Service (Canada), the Policy on Conflict of Interest and Post-Employment (Canada), and the Conflict of Interest Act (Canada), as applicable.`,
              `The Applicant understands that all costs incurred in the preparation and submission of the application shall be wholly absorbed by the Applicant.`,
              `The Applicant understands that the Program reserves the right to make partial awards and to negotiate project scope changes with Applicants.`,
              `The Applicant understands that the Program is a discretionary program subject to available funding, and that submission of a complete application, meeting any or all of the eligibility criteria, does not guarantee that funding will be granted. All Applicants whose Projects are approved for funding will be notified in writing.`,
              `The Applicant acknowledges that it must ensure compliance with any applicable Canadian national security requirements as defined and/or administered by the Canadian security authorities, and any Provincial security requirements as defined and/or administered by the Province.`,
              `The Applicant acknowledges that it must have the managerial and financial capacity to deliver this proposed project on time and within budget and to maintain the infrastructure and services on an ongoing basis for five years after project completion.`,
              `The Applicant confirms that it is requesting the lowest possible Program contribution amount required to make this proposed Project financially viable.`,
              `The Applicant acknowledges that information provided in this Application Form (including attachments) may be shared between the Province and the Government of Canada and other levels of government to promote the Program and maximize the benefits to Canadian citizens and permanent residents.`,
              `The Applicant acknowledges that all activities required for this proposed Project must comply with all applicable federal, provincial, and territorial laws, regulations, municipal and other local by-laws.`,
              `The Applicant acknowledges that knowingly making any false statements or misrepresentations, including by omission, in an application may affect its eligibility and may result in the revocation of funding approval.`,
              `The Applicant acknowledges that information submitted in an application is subject to the Access to Information Act (Canada) or the Freedom of Information and Protection of Privacy Act (BC), as applicable.`,
              `The Applicant confirms that, to the best of its knowledge, the information submitted in this application is true and correct as of the date of submission.`,
            ],
          },
          organizationProfile: {
            organizationName: 'org name',
          },
          submission: {
            submissionDate: '2022-10-26',
            submissionTitle: 'Test Title',
            submissionCompletedBy: 'Test Person',
            submissionCompletedFor: 'Test Company',
          },
        },
        lastEditedPage: 'projectInformation',
        formDataRowId: formDataRowId,
      },
    },
  });

  http.post(
    __ENV.APP_HOST + '/graphql',
    updateApplicationPayload,
    Object.assign({}, postParams, {
      tags: { name: 'updateApplicationFormMutation' },
    })
  );

  const submitApplicationPayload = JSON.stringify({
    id: 'submitApplicationMutation',
    query: `
      mutation submitApplicationMutation($input: SubmitApplicationInput!) {
        submitApplication(input: $input) {
          application {
            updatedAt
            status
          ccbcNumber
            intakeId
          }
        }
      }`,

    variables: {
      input: {
        applicationRowId: applicationRowId,
      },
    },
  });

  check(
    http.post(
      __ENV.APP_HOST + '/graphql',
      submitApplicationPayload,
      Object.assign({}, postParams, {
        tags: { name: 'submitApplicationMutation' },
      })
    ),
    {
      'no errors': (r) => {
        const errors = r.json().errors;
        if (errors) console.log(errors);
        return !errors;
      },
    }
  );
};

export default mutations;
