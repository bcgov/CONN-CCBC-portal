import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import Link from 'next/link';

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
  color: ${(props) => props.theme.color.links};
  text-decoration: none;
`;

const ReadOnlySubmissionWidget: React.FC<WidgetProps> = ({
  id,
  value,
  formContext,
}) => {
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
            <StyledLink href={`/applicantportal/form/${formContext.rowId}/20`}>
              {` Acknowledgements `}
            </StyledLink>
            page.
          </>
        )}
      </StyledError>
      <StyledError>
        {!formContext?.fullFormData?.review?.acknowledgeIncomplete && (
          <>
            <br />
            There is missing information in this application. Please see the
            <StyledLink href={`/applicantportal/form/${formContext.rowId}/19`}>
              {` Review `}
            </StyledLink>
            page
            <br />
            To submit the application with missing information, please complete
            the acknowledgements at the bottom of the review page.
          </>
        )}
      </StyledError>
    </>
  );
};

export default ReadOnlySubmissionWidget;
