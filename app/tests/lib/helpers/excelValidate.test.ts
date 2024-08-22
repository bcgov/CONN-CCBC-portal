import excelValidateGenerator from 'lib/helpers/excelValidate';

describe('excelValidateGenerator', () => {
  const mockResponse = {
    json: jest.fn().mockResolvedValue([]),
  };
  global.fetch = jest.fn().mockResolvedValue(mockResponse);
  const mockApiPath = '/api/analyst/sow/1/CCBC-010001/0';
  const mockSetExcelFile = jest.fn();
  const mockSetExcelValidationErrors = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call setExcelFile with the provided file', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const validate = excelValidateGenerator(
      mockApiPath,
      mockSetExcelFile,
      mockSetExcelValidationErrors
    );

    await validate(mockFile);

    expect(mockSetExcelFile).toHaveBeenCalledWith(mockFile);
  });

  test('should fail when the operation takes too long', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Timeout'));
    const mockFile = new File(['test'], 'test.txt');
    const validate = excelValidateGenerator(
      mockApiPath,
      mockSetExcelFile,
      mockSetExcelValidationErrors
    );

    await validate(mockFile);

    expect(mockSetExcelFile).toHaveBeenCalledWith(mockFile);
  });

  test('should call setExcelValidationErrors with an empty array', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const validate = excelValidateGenerator(
      mockApiPath,
      mockSetExcelFile,
      mockSetExcelValidationErrors
    );

    await validate(mockFile);

    expect(mockSetExcelValidationErrors).toHaveBeenCalledWith([]);
  });

  test('should call setExcelValidationErrors with the received error list', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const mockErrorList = [
      { level: 'summary', error: 'Error 1', filename: 'test.txt' },
      { level: 'tab', error: 'Error 2', filename: 'test.txt' },
    ];
    const mockCheckCallsValidationResponse = {
      json: jest.fn().mockResolvedValue(mockErrorList),
    };
    global.fetch = jest
      .fn()
      .mockResolvedValue(mockCheckCallsValidationResponse);

    const validate = excelValidateGenerator(
      mockApiPath,
      mockSetExcelFile,
      mockSetExcelValidationErrors
    );

    await validate(mockFile);

    expect(mockSetExcelValidationErrors).toHaveBeenCalledWith(mockErrorList);
  });

  test('should call setExcelValidationErrors with an empty array when no error list is received', async () => {
    const mockFile = new File(['test'], 'test.txt');
    const mockCheckEmptyErrorsResponse = {
      json: jest.fn().mockResolvedValue([]),
    };
    global.fetch = jest.fn().mockResolvedValue(mockCheckEmptyErrorsResponse);

    const validate = excelValidateGenerator(
      mockApiPath,
      mockSetExcelFile,
      mockSetExcelValidationErrors
    );

    await validate(mockFile);

    expect(mockSetExcelValidationErrors).toHaveBeenCalledWith([]);
  });
});
