import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import Toast, { ToastType } from 'components/Toast';
import UnsavedChangesProvider from 'components/UnsavedChangesProvider';

type AppContextType = {
  showToast?: (message: ReactNode, type?: ToastType, timeout?: number) => void;
  hideToast?: () => void;
};

const AppContext = createContext<AppContextType>({});

export const useToast = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  /**
   * handling global toast messages
   */
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
    <AppContext.Provider value={contextValue}>
      <UnsavedChangesProvider>
        {children}
        {toast?.visible && (
          <Toast type={toast?.type} onClose={hideToast} timeout={toast.timeout}>
            {toast.message}
          </Toast>
        )}
      </UnsavedChangesProvider>
    </AppContext.Provider>
  );
};
