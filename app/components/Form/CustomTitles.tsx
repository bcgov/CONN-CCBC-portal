import Link from '@button-inc/bcgov-theme/Link';
import { INTAKE_3_AREAS_OF_INTEREST } from 'data/externalConstants';

const ProjectBenefits = (
  <div>
    <p>
      Please summarize the benefits that the Project will bring to the targeted
      areas. Describe the benefits and sustainability of the Project in terms
      of:
    </p>
    <ul>
      <li>Social and economic benefits</li>
      <li>Improvements to community connectivity</li>
      <li>Facilitation of commercial or industrial development</li>
      <li>Improvement of public services or social programs delivery</li>
      <li>Improvement of small businesses</li>
      <li>Enhancement of entrepreneurship capacity</li>
      <li>
        The Applicant organization’s corporate social responsibility policy and
        philanthropic practices, including how the organization promotes
        reconciliation, gender equality and diversity or how your organization
        gives back to the community.
      </li>
    </ul>
    <p>
      To support claims of social and economic benefits, Applicants should
      provide letters of support and the accompanying Template 6: Community and
      Rural Development Benefits at the uploads section.
    </p>
  </div>
);

const IndigenousEntity = (
  <div>
    <p>
      Is this Applicant organization an Indigenous identity? An Indigenous
      identity may include:
    </p>
    <ul>
      <li>
        A for-profit or non-profit organization run by and for First Nations,
        M&eacute;tis, or Inuit peoples;
      </li>
      <li>A band council within the meaning of section 2 of the Indian Act;</li>
      <li>
        An Indigenous government authority established by a Self-Government
        Agreement or a Comprehensive Land Claim Agreement
      </li>
    </ul>
  </div>
);

const GeographicArea = (
  <div>
    Referring to the{' '}
    <Link
      href="https://catalogue.data.gov.bc.ca/dataset/8fbfc57f-4381-4a10-a4e8-0f335c6fe39a/resource/e12440ae-0b5d-40dc-af4f-2098f0b9374f"
      target="_blank"
      rel="noopener noreferrer"
    >
      project zones
    </Link>{' '}
    (application guide Annex 6), which zone(s) will this project be conducted
    in?
  </div>
);

const GeographicAreaNotice = (
  <strong>
    IMPORTANT: For this intake, CCBC is considering the following projects:
    <ul>
      <li>
        Projects in certain areas of interest in the province (within zones 1,
        2, 3, and 6) that remain underserved as outlined in maps in the{' '}
        <Link
          href={INTAKE_3_AREAS_OF_INTEREST}
          target="_blank"
          rel="noopener noreferrer"
        >
          BC Data catalogue;
        </Link>{' '}
        and or
      </li>
      <li>
        Projects that are First Nation-led or First Nation-supported in any area
        of the province.
      </li>
    </ul>
  </strong>
);

const SupportingDocuments = (
  <div>
    Please upload additional attachments. Please avoid using special characters
    in the file name. Files must be less than 100mb. If you must submit a file
    larger than this, please contact{' '}
    <Link href="mailto:connectingcommunitiesbc@gov.bc.ca">
      connectingcommunitiesbc@gov.bc.ca
    </Link>
  </div>
);

const GeographicCoverageMap = (
  <div>
    Use ISED&lsquo;s{' '}
    <Link
      href="https://www.ic.gc.ca/app/scr/sittibc/web"
      target="_blank"
      rel="noopener noreferrer"
    >
      Eligibility Mapping Tool
    </Link>{' '}
    to generate the Project Coverage for this application.
  </div>
);

export {
  GeographicArea,
  GeographicCoverageMap,
  GeographicAreaNotice,
  IndigenousEntity,
  ProjectBenefits,
  SupportingDocuments,
};
