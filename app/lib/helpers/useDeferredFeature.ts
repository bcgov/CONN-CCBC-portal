import { useEffect, useRef, useState } from 'react';
import { useFeatureFlagMap } from 'components/FeatureFlagProvider';

export type JSONValue =
  null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue };

// Returns `defaultValue` during SSR/hydration so server and client trees match, then adopts the real flag value after mount.
export default function useDeferredFeature<T extends JSONValue = boolean>(
  featureKey: string,
  defaultValue: T = false as unknown as T
): T {
  const flags = useFeatureFlagMap();
  const flag = flags[featureKey];
  const value = flag?.isEnabled
    ? ((flag.value as T) ?? (true as unknown as T))
    : undefined;

  const defaultValueRef = useRef(defaultValue);
  const [deferred, setDeferred] = useState<T>(defaultValueRef.current);

  useEffect(() => {
    const nextValue = (value as T) ?? defaultValueRef.current;
    setDeferred((currentValue) =>
      Object.is(currentValue, nextValue) ? currentValue : nextValue
    );
  }, [value]);

  return deferred;
}
