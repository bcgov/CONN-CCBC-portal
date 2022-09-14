import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';

const StyledButton = styled(Button)`
  margin-left: 24px;
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
    <div>
      <Button variant="primary" disabled={disabled}>
        {formatSubmitBtn()}
      </Button>
      {isSubmitPage && (
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
      )}
    </div>
  );
};

export default SubmitBtns;
