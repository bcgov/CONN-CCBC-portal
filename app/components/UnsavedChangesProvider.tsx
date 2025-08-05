import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { useRouter } from 'next/router';
import { useFeature } from '@growthbook/growthbook-react';
import UnsavedChangesWarningModal from './Modal/UnsavedChangesWarningModal';

type IUnsavedChangesContext = {
  updateDirtyState: (dirty: boolean) => void;
};

const UnsavedChangesContext = createContext<IUnsavedChangesContext | undefined>(
  undefined
);

const UnsavedChangesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [leavingPage, setLeavingPage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const confirmLeavePage = useRef<() => void>(() => {});
  const enableUnsavedChangesWarning = useFeature(
    'enable_unsaved_changes_warning'
  ).value;

  const updateDirtyState = useCallback((dirty: boolean) => {
    setIsDirty(dirty);
  }, []);

  const handleLogoutAction = useCallback(
    (event: SubmitEvent | MouseEvent, target: HTMLElement) => {
      event.preventDefault();
      confirmLeavePage.current = () => {
        sessionStorage.removeItem('dashboard_scroll_position');
        (target as HTMLButtonElement).form?.submit();
      };
      setLeavingPage(true);
    },
    []
  );

  const handleLinkNavigation = useCallback(
    (event: MouseEvent | SubmitEvent, target: HTMLElement) => {
      event.preventDefault();
      confirmLeavePage.current = () => {
        router.push((target as HTMLAnchorElement).href);
      };
      setLeavingPage(true);
    },
    [router]
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent | SubmitEvent) => {
      if (!isDirty || !enableUnsavedChangesWarning) return;

      let target: HTMLElement | null = null;
      if (event instanceof MouseEvent) {
        target = event.target as HTMLElement;
        while (
          target &&
          target.tagName !== 'A' &&
          target.tagName !== 'BUTTON'
        ) {
          target = target.parentElement as HTMLElement;
        }
      } else if (event instanceof SubmitEvent) {
        target = (event.target as HTMLFormElement).querySelector(
          '[data-button-id="Logout-button"]'
        );
      }

      // Skip if target has the skip attribute (applies to both buttons and links)
      if (target?.hasAttribute('data-skip-unsaved-warning')) {
        return;
      }

      if (target?.getAttribute('data-button-id') === 'Logout-button')
        handleLogoutAction(event, target);
      else if (target?.tagName === 'A' && (target as HTMLAnchorElement).href)
        handleLinkNavigation(event, target);
    };

    // Set listeners for clicks and logout form submission
    document.querySelectorAll('a, form, button').forEach((element) => {
      element.addEventListener('click', handleClick);
      element.addEventListener('submit', handleClick);
    });

    // Cleanup listeners
    return () => {
      document.querySelectorAll('a, form, button').forEach((element) => {
        element.removeEventListener('click', handleClick);
        element.removeEventListener('submit', handleClick);
      });
    };
  }, [
    enableUnsavedChangesWarning,
    handleLinkNavigation,
    handleLogoutAction,
    isDirty,
    router,
  ]);

  const handleModalCallback = () => {
    setLeavingPage(false);
    confirmLeavePage.current = () => {};
  };

  const context = useMemo<IUnsavedChangesContext>(
    () => ({ updateDirtyState }),
    [updateDirtyState]
  );

  return (
    <UnsavedChangesContext.Provider value={context}>
      {children}
      <UnsavedChangesWarningModal
        isOpen={leavingPage}
        onDismiss={handleModalCallback}
        onDiscard={() => {
          confirmLeavePage.current();
          setIsDirty(false);
          handleModalCallback();
        }}
      />
    </UnsavedChangesContext.Provider>
  );
};

export function useUnsavedChanges() {
  const context = useContext(UnsavedChangesContext);

  if (context === undefined) {
    throw new Error(
      'useUnsavedChanges must be called within <UnsavedChangesProvider />'
    );
  }
  return context;
}

export default UnsavedChangesProvider;
