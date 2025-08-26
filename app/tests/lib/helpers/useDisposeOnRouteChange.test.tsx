import { renderHook, act } from '@testing-library/react';
import useDisposeOnRouteChange from 'lib/helpers/useDisposeOnRouteChange';
import { useRouter } from 'next/router';

// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useDisposeOnRouteChange', () => {
  let mockRouter;
  let onMapper = {};

  beforeEach(() => {
    onMapper = {};
    // Mock router events
    mockRouter = {
      events: {
        on: jest.fn().mockImplementation((eventName, func) => {
          onMapper[eventName] = func;
        }),
        off: jest.fn(),
      },
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should set up an event listener on routeChangeStart', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { result } = renderHook(() => useDisposeOnRouteChange());

    expect(mockRouter.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should remove the event listener on unmount', () => {
    const { result, unmount } = renderHook(() => useDisposeOnRouteChange());

    act(() => {
      result.current({
        dispose: jest.fn(),
      });
    });

    unmount();

    expect(mockRouter.events.off).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should call dispose method on route change', () => {
    const dispose = jest.fn();
    const { result } = renderHook(() => useDisposeOnRouteChange());

    // Set disposable
    act(() => {
      result.current({
        dispose,
      });
    });

    // Simulate routeChangeStart event
    const handler = onMapper['routeChangeStart'];
    if (handler) {
      act(() => {
        handler();
      });
    }

    expect(dispose).toHaveBeenCalled();
  });
});
