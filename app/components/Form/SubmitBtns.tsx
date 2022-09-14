import Link from 'next/link';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';

const StyledFlex = styled('div')`
  display: flex;
`;

const StyledButton = styled(Button)`
  margin: 0 24px;
  white-space: nowrap;
  max-width: 200px;
  transition: all ease-in-out 0.7s;
`;

const StyledToast = styled('div')`
  background-color: ${(props) => props.theme.color.successGreen};
  border-radius: 4px;
  padding: 12px 24px;
  color: #ffffff;
  font-size: 16px;
  transition: all ease-in-out 0.1s 0.4s;

  & a {
    color: #ffffff;
  }
`;

type Props = {
  disabled: boolean;
  formData: any;
  isWithdrawn: boolean;
  isSubmitPage: boolean;
  saveAsDraft: boolean;
  saveForm: any;
  setSaveAsDraft: any;
};

const SubmitBtns = ({
  disabled,
  formData,
  isSubmitPage,
  isWithdrawn,
  saveAsDraft,
  saveForm,
  setSaveAsDraft,
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
              setSaveAsDraft && setSaveAsDraft();
              saveForm(formData);
            }}
            disabled={!saveAsDraft}
          >
            {saveAsDraft ? 'Save as draft' : 'Saved'}
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
