import sowValidateGenerator from 'lib/helpers/sowValidate';

describe('sowValidateGenerator', () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue([]),
  };
  global.fetch = jest.fn().mockResolvedValue(mockResponse);
  const mockRowId = 1;
  const mockCcbcNumber = 'ABC123';
  const mockSetSowFile = jest.fn();
  const mockSetSowValidationErrors = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call setSowFile with the provided file', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const validate = sowValidateGenerator(
      mockRowId,
      mockCcbcNumber,
      mockSetSowFile,
      mockSetSowValidationErrors
    );

    await validate(mockFile);

    expect(mockSetSowFile).toHaveBeenCalledWith(mockFile);
  });

  test('should call setSowValidationErrors with an empty array', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const validate = sowValidateGenerator(
      mockRowId,
      mockCcbcNumber,
      mockSetSowFile,
      mockSetSowValidationErrors
    );

    await validate(mockFile);

    expect(mockSetSowValidationErrors).toHaveBeenCalledWith([]);
  });

  test('should call setSowValidationErrors with the received error list', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const mockErrorList = [{ level: 'summary', error: 'Error 1', filename:'test.txt' },{ level: 'tab', error: 'Error 2', filename:'test.txt'}];
    const mockCheckCallsValidationResponse = {
      json: jest.fn().mockResolvedValue(mockErrorList),
    };
    global.fetch = jest
      .fn()
      .mockResolvedValue(mockCheckCallsValidationResponse);

    const validate = sowValidateGenerator(
      mockRowId,
      mockCcbcNumber,
      mockSetSowFile,
      mockSetSowValidationErrors
    );

    await validate(mockFile);

    expect(mockSetSowValidationErrors).toHaveBeenCalledWith(mockErrorList);
  });

  test('should call setSowValidationErrors with an empty array when no error list is received', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const mockCheckEmptyErrorsResponse = {
      json: jest.fn().mockResolvedValue([]),
    };
    global.fetch = jest.fn().mockResolvedValue(mockCheckEmptyErrorsResponse);

    const validate = sowValidateGenerator(
      mockRowId,
      mockCcbcNumber,
      mockSetSowFile,
      mockSetSowValidationErrors
    );

    await validate(mockFile);

    expect(mockSetSowValidationErrors).toHaveBeenCalledWith([]);
  });
});
