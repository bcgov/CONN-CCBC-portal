import { useEffect, useState } from 'react';
import { useFeature } from '@growthbook/growthbook-react';
import type { JSONValue } from '@growthbook/growthbook';

/**
 * Wrapper around GrowthBook's `useFeature` that defers the value until after
 * the first client-side render.  During SSR (and the initial hydration pass)
 * this returns `defaultValue` so the server and client trees are identical.
 * After mount the real feature-flag value is adopted.
 */
export default function useDeferredFeature<T extends JSONValue = boolean>(
  featureKey: string,
  defaultValue: T = false as unknown as T
): T {
  const { value } = useFeature<T>(featureKey);
  const [deferred, setDeferred] = useState<T>(defaultValue);

  useEffect(() => {
    setDeferred((value as T) ?? defaultValue);
  }, [value, defaultValue]);

  return deferred;
}
