import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Breakpoint, DialogActions, DialogTitle } from '@mui/material';
import { Button } from '@button-inc/bcgov-theme';
import LoadingSpinner from './LoadingSpinner';

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
  onClick: Function;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
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
      <DialogTitle>
        {title}
        <IconButton
          aria-label="close"
          data-testid="close-button"
          onClick={onClose}
          sx={{
            marginRight: '-2px',
            padding: 0,
            color: 'inherit',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions?.map((action) => (
          <Button
            data-testid={action.id}
            key={action.label}
            onClick={action.onClick}
            variant={action.variant || 'primary'}
            disabled={action.disabled || action.isLoading}
          >
            {action.label}{' '}
            {action.isLoading && <LoadingSpinner width="20" height="20" />}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
