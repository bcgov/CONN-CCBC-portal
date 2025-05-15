import headersMiddleware from '../../backend/lib/headers';

jest.mock('react-relay-network-modern');

describe('The headers middleware', () => {
  test('should add necessary headers to response', () => {
    const mockRequest = {};
    const mockResponse = {
      append: jest.fn(),
      setHeader: jest.fn(),
      removeHeader: jest.fn(),
      json: jest.fn(),
    };
    const nextFunction = jest.fn();

    const middleware = headersMiddleware();
    middleware(mockRequest, mockResponse, nextFunction);

    expect(mockResponse.append).toHaveBeenCalledWith(
      'Permissions-Policy',
      "display-capture 'none'"
    );
  });
});
