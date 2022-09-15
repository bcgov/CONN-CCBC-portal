import Link from 'next/link';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import LoadingSpinner from 'components/LoadingSpinner';

const StyledFlex = styled('div')`
  display: flex;
`;

const StyledButton = styled(Button)`
  margin: 0 24px;
  white-space: nowrap;
  min-width: 178px;
`;

const StyledToast = styled('div')`
  background-color: ${(props) => props.theme.color.successGreen};
  border-radius: 4px;
  padding: 12px 24px;
  color: #ffffff;
  font-size: 16px;
  transition: all ease-in-out 0.2s 0.3s;

  & a {
    color: #ffffff;
  }
`;

type Props = {
  disabled: boolean;
  formData: any;
  isWithdrawn: boolean;
  isSubmitPage: boolean;
  isUpdating: boolean;
  saveAsDraft: boolean;
  saveForm: any;
};

const SubmitBtns = ({
  disabled,
  formData,
  isSubmitPage,
  isUpdating,
  isWithdrawn,
  saveAsDraft,
  saveForm,
}: Props) => {
  console;
  const formatSubmitBtn = () => {
    if (isWithdrawn) {
      return 'Continue';
    }
    if (!isSubmitPage) {
      return 'Save and continue';
    }
    return 'Submit';
  };

  return (
    <StyledFlex>
      <Button variant="primary" disabled={disabled}>
        {formatSubmitBtn()}
      </Button>
      {isSubmitPage && (
        <>
          <StyledButton
            variant="secondary"
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              saveForm(formData, {}, false, true);
            }}
            disabled={isUpdating || !saveAsDraft}
            style={{ padding: isUpdating ? '4px 24px' : '12px 24px' }}
          >
            {isUpdating ? (
              <LoadingSpinner />
            ) : (
              <>{saveAsDraft ? 'Save as draft' : 'Saved'}</>
            )}
          </StyledButton>
          <StyledToast
            style={{
              visibility: saveAsDraft ? 'hidden' : 'visible',
              opacity: saveAsDraft ? 0 : 1,
            }}
          >
            The draft was successfully saved.{' '}
            <Link href="/dashboard">Return to dashboard</Link>.
          </StyledToast>
        </>
      )}
    </StyledFlex>
  );
};

export default SubmitBtns;
