import styled from 'styled-components';
import Alert from '@button-inc/bcgov-theme/Alert';
import Checkbox from '@button-inc/bcgov-theme/Checkbox';
import type { JSONSchema7 } from 'json-schema';

import {
  Accordion,
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
  formErrorSchema: any;
  noErrors: boolean;
};

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
  formErrorSchema,
  formSchema,
  noErrors,
  onReviewConfirm,
  reviewConfirm,
}: Props) => {
  // const [expand, setExpand] = useState(false);

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
      <StyledAlert
        id="review-alert"
        size="small"
        variant={noErrors ? 'success' : 'danger'}
      >
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

        const isError = formErrorSchema[section] != undefined;

        return (
          <Accordion
            id={section}
            defaultToggled={
              isError || (!isError && section === 'projectInformation')
            }
            error={isError}
            key={subschema.title}
            title={subschema.title}
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
                errorSchema={errorFieldKeys(formErrorSchema[section])}
                formData={formData[section]}
                subschema={subschema}
              />
            )}
          </Accordion>
        );
      })}
      <StyledCheckboxDiv>
        {!noErrors && (
          <>
            <Checkbox
              id="review-confirmation-checkbox"
              checked={reviewConfirm}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onReviewConfirm(event.target.checked)
              }
            />
            <StyledCheckboxLabel htmlFor="review-confirmation-checkbox">
              By checking this box, you acknowledge that there are incomplete
              fields and incomplete applications may not be assessed. If the
              incomplete fields are not applicable to you, please check the box
              and continue to the Declarations page.
            </StyledCheckboxLabel>
          </>
        )}
      </StyledCheckboxDiv>
    </div>
  );
};

export default Review;
