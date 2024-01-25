import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Breakpoint, DialogActions, DialogTitle } from '@mui/material';
import { Button } from '@button-inc/bcgov-theme';
import styled from 'styled-components';

const StyledDialogTitle = styled(DialogTitle)`
  background-color: #38598a;
  color: #ffffff;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
`;

const StyledIconButton = styled(IconButton)`
  padding: 0;
  margin-right: -2px;
  color: #fff;
`;

const StyledDialogContent = styled(DialogContent)`
  text-align: left;
  padding: 16px 24px 0 24px;
  margin-top: 1.5em;
`;

const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
  padding: 0 16px 24px 16px;
`;

interface Props {
  children: React.ReactNode;
  id?: string;
  onClose: any;
  open: boolean;
  actions?: ActionProps[];
  title?: string;
  size?: Breakpoint;
}

interface ActionProps {
  id: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const Modal: React.FC<Props> = ({
  children,
  id,
  onClose,
  open,
  title,
  actions,
  size = 'xl',
}) => {
  return (
    <Dialog
      componentsProps={{
        backdrop: { style: { backgroundColor: '#e3e3e3', opacity: 0.75 } },
      }}
      id={id}
      onClose={onClose}
      open={open}
      aria-labelledby={title}
      maxWidth={size}
      data-testId={id}
    >
      <StyledDialogTitle>
        {title}
        <StyledIconButton
          aria-label="close"
          data-testid="close-button"
          onClick={onClose}
        >
          <CloseIcon />
        </StyledIconButton>
      </StyledDialogTitle>
      <StyledDialogContent>{children}</StyledDialogContent>
      <StyledDialogActions>
        {actions?.map((action) => (
          <Button
            data-testid={action.id}
            key={action.label}
            onClick={action.onClick}
            variant={action.variant || 'primary'}
          >
            {action.label}
          </Button>
        ))}
      </StyledDialogActions>
    </Dialog>
  );
};

export default Modal;
