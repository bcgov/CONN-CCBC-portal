import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import Link from 'next/link';
import getFormPage from 'utils/getFormPage';

export const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

export const StyledValue = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  padding: 0.6em 0;
`;

const StyledError = styled('div')`
  color: #e71f1f;
  font-weight: 700;
`;

const StyledLink = styled(Link)`
  color: #e71f1f;
`;

const StyledList = styled.ul`
  margin-bottom: 0.5rem;
`;

const StyledListItem = styled.li`
  margin-bottom: 0;
`;

const ReadOnlySubmissionWidget: React.FC<WidgetProps> = ({
  id,
  value,
  formContext,
}) => {
  const uiSchema = formContext.finalUiSchema['ui:order'];
  const acceptedProjectAreas = formContext?.acceptedProjectAreasArray || null;
  const allowUnlistedFnLedZones = formContext?.allowUnlistedFnLedZones ?? true;
  const noErrors = Object.keys(formContext?.formErrorSchema).length === 0;

  const projectAreaLink = (
    <>
      {' '}
      <StyledLink
        href={`/applicantportal/form/${formContext.rowId}/${getFormPage(
          uiSchema,
          'projectArea'
        )}`}
      >
        Project Area
      </StyledLink>{' '}
    </>
  );

  return (
    <>
      <StyledContainer>
        <StyledValue id={id}>{value}</StyledValue>
      </StyledContainer>
      <StyledError>
        {!formContext?.areAllAcknowledgementsChecked && (
          <>
            All acknowledgements must be checked before submitting the
            application. Please return to the
            <StyledLink
              href={`/applicantportal/form/${formContext.rowId}/${getFormPage(
                uiSchema,
                'acknowledgements'
              )}`}
            >
              {` Acknowledgements `}
            </StyledLink>
            page.
          </>
        )}
      </StyledError>
      <StyledError>
        {!noErrors &&
          !formContext?.fullFormData?.review?.acknowledgeIncomplete && (
            <>
              <br />
              There is missing information in this application. Please see the
              <StyledLink
                href={`/applicantportal/form/${formContext.rowId}/${getFormPage(
                  uiSchema,
                  'review'
                )}`}
              >
                {` Review `}
              </StyledLink>
              page
              <br />
              To submit the application with missing information, please
              complete the acknowledgements at the bottom of the review page.
            </>
          )}
      </StyledError>
      <StyledError>
        {!formContext.isProjectAreaSelected && (
          <>
            <br />
            You must select a zone on the {projectAreaLink} page to be able
            submit an application.
          </>
        )}
      </StyledError>
      <StyledError>
        {formContext.isProjectAreaSelected &&
          formContext.isProjectAreaInvalid && (
            <>
              <br />
              {allowUnlistedFnLedZones ? (
                <>
                  For this intake CCBC is considering 2 types of projects;
                  <StyledList>
                    <StyledListItem>
                      ones that are Zones: {acceptedProjectAreas?.toString()},
                      or
                    </StyledListItem>
                    <StyledListItem>
                      projects that are First Nations-led or First
                      Nations-supported in any area of the province.
                    </StyledListItem>
                  </StyledList>
                </>
              ) : (
                <>
                  For this intake CCBC is considering projects in Zones:{' '}
                  {acceptedProjectAreas?.toString()}.
                </>
              )}
              Please review your selections on the {projectAreaLink} page to
              ensure your project meets these requirements to be able to submit
              it during this intake.
            </>
          )}
      </StyledError>
    </>
  );
};

export default ReadOnlySubmissionWidget;
