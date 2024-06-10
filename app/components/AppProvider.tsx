import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import Toast, { ToastType } from 'components/Toast';

type ToastContextType = {
  showToast?: (message: ReactNode, type?: ToastType, timeout?: number) => void;
  hideToast?: () => void;
};

const ToastContext = createContext<ToastContextType>({});

export const useToast = () => {
  return useContext(ToastContext);
};

export const AppProvider = ({ children }) => {
  const [toast, setToast] = useState<{
    visible: boolean;
    message?: ReactNode;
    type?: ToastType;
    timeout?: number;
  }>({ visible: false });

  const showToast = useCallback(
    (
      message: ReactNode,
      type: ToastType = 'success',
      timeout: number = 10000
    ) => {
      setToast({ visible: true, message, type, timeout });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast({ visible: false });
  }, []);

  const contextValue = useMemo(
    () => ({ showToast, hideToast }),
    [showToast, hideToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast?.visible && (
        <Toast type={toast?.type} onClose={hideToast} timeout={toast.timeout}>
          {toast.message}
        </Toast>
      )}
    </ToastContext.Provider>
  );
};
