import { useRouter } from 'next/router';
import Link from 'next/link';
import { WidgetProps } from '@rjsf/utils';
import styled from 'styled-components';
import getFormPage from 'utils/getFormPage';
import { StyledContainer, StyledValue } from './ReadOnlySubmissionWidget';

const StyledError = styled('div')`
  color: #e71f1f;
  font-weight: 700;
`;

const StyledLink = styled(Link)`
  color: #e71f1f;
`;

const SubmissionCompletedForWidget: React.FC<WidgetProps> = ({ id, value }) => {
  const router = useRouter();
  const rowId = router.query.id;

  const pageNumber = getFormPage('organizationProfile');

  return (
    <StyledContainer>
      <StyledValue id={id}>
        {value || (
          <StyledError>
            No legal organization name was provided. Please return to the{' '}
            <StyledLink href={`/applicantportal/form/${rowId}/${pageNumber}`}>
              Organization Profile
            </StyledLink>{' '}
            page and enter one.
          </StyledError>
        )}
      </StyledValue>
    </StyledContainer>
  );
};

export default SubmissionCompletedForWidget;
