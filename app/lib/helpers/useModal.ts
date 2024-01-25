import { useState } from 'react';

const useModal = () => {
  const [isOpen, setOpen] = useState(false);

  const open = () => {
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
  };

  return { isOpen, open, close };
};

export default useModal;
