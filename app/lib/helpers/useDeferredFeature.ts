import { useEffect, useState } from 'react';
import { useFeature } from '@growthbook/growthbook-react';

/**
 * Wrapper around GrowthBook's `useFeature` that defers the value until after
 * the first client-side render.  During SSR (and the initial hydration pass)
 * this returns `defaultValue` so the server and client trees are identical.
 * After mount the real feature-flag value is adopted.
 */
export default function useDeferredFeature<T = boolean>(
  featureKey: string,
  defaultValue: T = false as unknown as T
): T {
  const { value } = useFeature<T>(featureKey);
  const [deferred, setDeferred] = useState<T>(defaultValue);

  useEffect(() => {
    setDeferred(value ?? defaultValue);
  }, [value, defaultValue]);

  return deferred;
}
