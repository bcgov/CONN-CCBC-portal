import Accordion from '@button-inc/bcgov-theme/Accordion';
import styled from 'styled-components';
import Alert from '@button-inc/bcgov-theme/Alert';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import type { JSONSchema7 } from 'json-schema';

// https://github.com/rjsf-team/react-jsonschema-form/issues/2131
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validateFormData from '@rjsf/core/dist/cjs/validate';

import {
  BudgetDetailsTable,
  OrganizationLocationTable,
  OtherFundingSourcesTable,
  ProjectAreaTable,
  ProjectFundingTable,
  Table,
} from '.';

type Props = {
  formData: any;
  onReviewConfirm: any;
  reviewConfirm: boolean;
  formSchema: any;
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

const StyledCheckboxLabel = styled('label')`
  padding-left: 1em;
`;

const StyledCheckboxDiv = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px 0;

  & span {
    border-radius: 2px;
  }

  & label {
    padding-left: 1em;
  }
`;

const StyledAlert = styled(Alert)`
  margin-bottom: 32px;
`;

// Todo: expand/collapse all functionality
// const StyledExpandDiv = styled('div')`
//   display: flex;
//   justify-content: flex-end;
//   min-width: 100%;
//   margin: 16px 0;
// `;

// const StyledExpandButton = styled('button')`
//   border: none;
//   background: none;
//   cursor: pointer;
//   color: ${(props) => props.theme.color.links};
// `;

const Review = ({
  formData,
  formSchema,
  onReviewConfirm,
  reviewConfirm,
}: Props) => {
  // const [expand, setExpand] = useState(false);
  const formErrorSchema = validateFormData(formData, formSchema)?.errorSchema;
  const noErrors = Object.keys(formErrorSchema).length === 0;

  const reviewSchema = [
    'projectInformation',
    'projectArea',
    'existingNetworkCoverage',
    'budgetDetails',
    'projectFunding',
    'otherFundingSources',
    'techSolution',
    'benefits',
    'projectPlan',
    'estimatedProjectEmployment',
    'templateUploads',
    'supportingDocuments',
    'mapping',
    'organizationProfile',
    'organizationLocation',
    'contactInformation',
    'alternateContact',
    'authorizedContact',
  ];
  return (
    <div>
      {/* <StyledExpandDiv>
        <StyledExpandButton
          onClick={(e) => {
            e.preventDefault();
            setExpand(!expand);
          }}
        >
          {!expand ? 'Expand all' : 'Collapse all'}
        </StyledExpandButton>
      </StyledExpandDiv> */}
      <StyledAlert size="small" variant={noErrors ? 'success' : 'danger'}>
        {noErrors
          ? 'All fields are complete'
          : 'There are empty fields in your application. Applications with unanswered fields may not be assessed.'}
      </StyledAlert>
      {reviewSchema.map((section) => {
        const subschema = formSchema.properties[section];

        const customTable = [
          'budgetDetails',
          'organizationLocation',
          'otherFundingSources',
          'projectArea',
          'projectFunding',
        ];

        if (!subschema) return;

        const errorFieldKeys = (formErrorSchema: JSONSchema7) => {
          const errorFields = formErrorSchema
            ? Object.keys(formErrorSchema)
            : [];

          return errorFields;
        };

        return (
          <StyledAccordion
            id={section}
            key={subschema.title}
            title={subschema.title}
            defaultToggled={true}
          >
            {!customTable.includes(section) && (
              <Table
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'otherFundingSources' && (
              <OtherFundingSourcesTable
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'projectFunding' && (
              <ProjectFundingTable
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'projectArea' && (
              <ProjectAreaTable
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'budgetDetails' && (
              <BudgetDetailsTable
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}

            {section === 'organizationLocation' && (
              <OrganizationLocationTable
                errorSchema={formErrorSchema[section]}
                formData={formData[section]}
                subschema={subschema}
              />
            )}
          </StyledAccordion>
        );
      })}
      <StyledCheckboxDiv>
        <Checkbox
          id="review-confirmation-checkbox"
          checked={reviewConfirm}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onReviewConfirm(event.target.checked)
          }
        />
        <StyledCheckboxLabel htmlFor="review-confirmation-checkbox">
          The Applicant acknowledges that there are unanswered fields and
          incomplete applications may not be assessed.
        </StyledCheckboxLabel>
      </StyledCheckboxDiv>
    </div>
  );
};

export default Review;
