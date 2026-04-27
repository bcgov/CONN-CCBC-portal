import getConfig from 'next/config';
import {
  EmailTemplate,
  EmailTemplateProvider,
} from '../handleEmailNotification';

interface EmailTemplateParams {
  templateNumber: string;
  uuid: string;
  organizationName: string | undefined;
  projectTitle: string | undefined;
  uploadedAt: string | undefined;
}

const notifyFailedReadOfTemplateData: EmailTemplateProvider = (
  applicationId: string,
  url: string,
  initiator,
  params: EmailTemplateParams
): EmailTemplate => {
  const namespace = getConfig()?.publicRuntimeConfig?.OPENSHIFT_APP_NAMESPACE;
  let env = 'Dev';
  if (namespace?.endsWith('-prod')) {
    env = 'Prod';
  } else if (namespace?.endsWith('-test')) {
    env = 'Test';
  }

  return {
    emailTo: [111, 112, 113, 114, 115],
    emailCC: [],
    tag: 'failed-read-of-template-data',
    subject: `Template ${params.templateNumber} - Failed Response`,
    body: `
    <p>
    The following template upload by an applicant had a failed response at ${params.uploadedAt}:
    </p>
    <ul>
      <li>Environment: ${env}</li>
      <li>File UUID: ${params.uuid}</li>
      <li>Template Number: ${params.templateNumber}</li>
      <li>Application ID: ${applicationId}</li>
    </ul>
    `,
  };
};

export default notifyFailedReadOfTemplateData;
