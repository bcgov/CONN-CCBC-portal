import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Disposable } from 'relay-runtime';

/**
 * Custom hook that takes an initial disposable from relay-runtime and ensures
 * that the .dispose() method is called when the URL changes due to client-side
 * routing in Next.js.
 *
 * @param {Disposable | null} initialDisposable - Initial disposable from relay-runtime.
 * @return {(disposable: Disposable) => void} - Function to set the disposable.
 */
const useDisposeOnRouteChange = (
  initialDisposable: Disposable | null = null
) => {
  const [disposable, setDisposable] = useState<Disposable | null>(
    initialDisposable
  );
  const router = useRouter();

  useEffect(() => {
    const handleDispose = () => {
      if (disposable?.dispose) {
        disposable.dispose();
      }
    };

    router.events.on('routeChangeStart', handleDispose);

    return () => {
      router.events.off('routeChangeStart', handleDispose);
    };
  }, [disposable, router.events]);

  return setDisposable;
};

export default useDisposeOnRouteChange;
