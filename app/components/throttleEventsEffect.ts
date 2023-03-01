import throttle from 'lodash.throttle';

const throttleEventsEffect: (
  throttledCallback: () => void,
  throttleTime?: number,
  events?: string[]
) => () => () => void =
  (
    throttledCallback,
    throttleTime = 1000 * 60 * 5, // 5 minutes
    events = ['keydown', 'mousedown', 'scroll']
  ) =>
  () => {
    const throttledSession = throttle(throttledCallback, throttleTime, {
      leading: false,
      trailing: true,
    });

    events.forEach((event) => {
      window.addEventListener(event, throttledSession);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledSession);
      });
      throttledSession.cancel();
    };
  };

export default throttleEventsEffect;
