import { renderHook, act } from '@testing-library/react-hooks/dom';
import useDisposeOnRouteChange from 'lib/helpers/useDisposeOnRouteChange';
import { useRouter } from 'next/router';
// Mock the Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('useDisposeOnRouteChange', () => {
  let setDisposable;
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

    // Render the hook
    const { result } = renderHook(() => useDisposeOnRouteChange());
    setDisposable = result.current;
  });

  it('should set up an event listener on routeChangeStart', () => {
    expect(mockRouter.events.on).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should remove the event listener on unmount', () => {
    act(() => {
      setDisposable({
        dispose: jest.fn(),
      });
    });

    expect(mockRouter.events.off).toHaveBeenCalledWith(
      'routeChangeStart',
      expect.any(Function)
    );
  });

  it('should call dispose method on route change', () => {
    const dispose = jest.fn();

    // Set disposable
    act(() => {
      setDisposable({
        dispose,
      });
    });

    // Simulate routeChangeStart event
    const handler = onMapper['routeChangeStart'];
    if (handler) {
      handler();
    }

    expect(dispose).toHaveBeenCalled();
  });
});
