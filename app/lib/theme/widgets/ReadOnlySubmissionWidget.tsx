import { useRouter } from 'next/router';
import Link from 'next/link';
import { WidgetProps } from '@rjsf/core';
import styled from 'styled-components';
import schema from '../../../formSchema/schema';

const StyledContainer = styled('div')`
  margin-bottom: 8px;
`;

const StyledValue = styled('div')`
  margin-top: 12px;
  margin-bottom: 4px;
  padding: 0.6em 0;
  white-space: nowrap;
`;

const StyledError = styled('div')`
  color: #e71f1f;
  font-weight: 700;
`;

const StyledLink = styled(Link)`
  color: #e71f1f;
`;

const ReadOnlySubmissionWidget: React.FC<WidgetProps> = ({ value }) => {
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

export default ReadOnlySubmissionWidget;
