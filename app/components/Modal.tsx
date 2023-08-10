import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';

interface Props {
  children: React.ReactNode;
  id?: string;
  onClose: any;
  open: boolean;
  title?: string;
}

const Modal: React.FC<Props> = ({ children, id, onClose, open, title }) => {
  return (
    <Dialog
      id={id}
      onClose={onClose}
      open={open}
      aria-labelledby="title"
      maxWidth="xl"
    >
      <DialogTitle
        sx={{
          bgcolor: '#38598A',
          color: '#FFFFFF',
        }}
      >
        {title}
        {onClose ? (
          <IconButton
            aria-label="close"
            data-testid="close-button"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 6,
              color: '#FFF',
            }}
          >
            X
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
