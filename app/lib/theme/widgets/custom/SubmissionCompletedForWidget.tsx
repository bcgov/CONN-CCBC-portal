import { useRouter } from 'next/router';
import Link from 'next/link';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import schema from '../../../../formSchema/schema';
import { StyledContainer, StyledValue } from './ReadOnlySubmissionWidget';

const StyledError = styled('div')`
  color: #e71f1f;
  font-weight: 700;
`;

const StyledLink = styled(Link)`
  color: #e71f1f;
`;

const SubmissionCompletedForWidget: React.FC<WidgetProps> = ({ value }) => {
  const router = useRouter();
  const { id } = router.query;

  const pageNumber =
    Object.keys(schema.properties).indexOf('organizationProfile') + 1;

  return (
    <StyledContainer>
      <StyledValue>
        {value ? (
          value
        ) : (
          <StyledError>
            No legal organization name was provided. Please return to the{' '}
            <StyledLink href={`/form/${id}/${pageNumber}`}>
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
