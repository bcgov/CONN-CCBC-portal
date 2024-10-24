import Link from 'next/link';
import styled from 'styled-components';
import Button from '@button-inc/bcgov-theme/Button';
import LoadingSpinner from 'components/LoadingSpinner';
import { UseDebouncedMutationConfig } from 'schema/mutations/useDebouncedMutation';
import { useRouter } from 'next/router';
import { updateApplicationFormMutation } from '__generated__/updateApplicationFormMutation.graphql';

const StyledFlex = styled('div')`
  display: flex;
  flex-direction: column;

  ${(props) => props.theme.breakpoint.largeUp} {
    flex-direction: row;
  }
`;

const StyledButton = styled(Button)`
  max-width: ${(props) => props.theme.width.inputWidthFull};
  white-space: nowrap;
  ${(props) => props.theme.breakpoint.mediumUp} {
    max-width: 260px;
  }
`;

const StyledDraftButton = styled(StyledButton)`
  margin: 24px 0;
  min-width: 178px;

  ${(props) => props.theme.breakpoint.largeUp} {
    margin: 0 24px;
  }
`;

const StyledToast = styled('div')`
  background-color: ${(props) => props.theme.color.success};
  border-radius: 4px;
  padding: 12px 24px;
  color: #ffffff;
  font-size: 16px;
  transition: all ease-in-out 0.2s 0.2s;
  text-align: center;

  & a {
    color: #ffffff;
  }
`;

type Props = {
  disabled: boolean;
  formData: any;
  isSubmitPage: boolean;
  isAcknowledgementPage: boolean;
  isUpdating: boolean;
  isEditable: boolean;
  savedAsDraft: boolean;
  saveForm: (
    formData: any,
    mutationConfig?: Partial<
      UseDebouncedMutationConfig<updateApplicationFormMutation>
    >,
    isRedirectingToNextPage?: boolean,
    isSaveAsDraftBtn?: boolean
  ) => void;
  status: string;
};

const SubmitButtons = ({
  disabled,
  formData,
  isSubmitPage,
  isAcknowledgementPage,
  isUpdating,
  isEditable,
  savedAsDraft,
  saveForm,
  status,
}: Props) => {
  const isDraft = status === 'draft';
  const isSubmitted = status === 'submitted';
  const isDraftAndSubmitPage = isDraft && isSubmitPage && isEditable;
  const isSubmittedAndSubmitPage =
    (isSubmitted && isSubmitPage) || (isSubmitPage && !isEditable);
  const router = useRouter();

  const formatSaveAsDraftBtn = () => (savedAsDraft ? 'Saved' : 'Save as draft');
  const formatSubmitBtn = () => {
    if (
      (isSubmitted && isAcknowledgementPage) ||
      (!isEditable && !isSubmitPage)
    ) {
      return 'Continue';
    }
    if (!isSubmitPage) {
      return 'Save and continue';
    }
    if (isSubmitPage && isSubmitted && isEditable) {
      return 'Changes submitted';
    }
    return 'Submit';
  };

  return (
    <StyledFlex>
      <StyledButton variant="primary" disabled={disabled}>
        {formatSubmitBtn()}
      </StyledButton>
      {isDraftAndSubmitPage && (
        <>
          <StyledDraftButton
            variant="secondary"
            onClick={(e: React.MouseEvent<HTMLInputElement>) => {
              e.preventDefault();
              saveForm(formData, {}, false, true);
            }}
            disabled={isUpdating || savedAsDraft}
            style={{ padding: isUpdating ? '4px 24px' : '12px 24px' }}
          >
            {isUpdating ? <LoadingSpinner /> : formatSaveAsDraftBtn()}
          </StyledDraftButton>
          <StyledToast
            style={{
              visibility: savedAsDraft ? 'visible' : 'hidden',
              opacity: savedAsDraft ? 1 : 0,
            }}
          >
            The draft was successfully saved.{' '}
            <Link href="/applicantportal/dashboard">Return to dashboard</Link>.
          </StyledToast>
        </>
      )}
      {isSubmittedAndSubmitPage && (
        <StyledButton
          variant="secondary"
          style={{ marginLeft: '24px' }}
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.preventDefault();
            router.push('/applicantportal/dashboard');
          }}
        >
          Return to dashboard
        </StyledButton>
      )}
    </StyledFlex>
  );
};

export default SubmitButtons;
