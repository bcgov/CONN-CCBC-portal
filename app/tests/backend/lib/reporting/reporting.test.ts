/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import reporting from '../../../../backend/lib/reporting/reporting';
import {
  compareGcpeReports,
  compareAndGenerateGcpeReport,
  regenerateGcpeReport,
  generateGcpeReport,
} from '../../../../backend/lib/reporting/gcpe';

jest.mock('.../../../../backend/lib/reporting/gcpe');

describe('Reporting API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', reporting);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a GCPE report and return a buffer and rowId', async () => {
    const mockBuffer = Buffer.from('test content');
    const mockBlob = new Blob([mockBuffer]);

    (generateGcpeReport as jest.Mock).mockResolvedValue({
      blob: mockBlob,
      rowId: 2,
    });

    const response = await request(app).get('/api/reporting/gcpe');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ buffer: expect.anything(), rowId: 2 });
    expect(generateGcpeReport).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should compare GCPE reports and return a buffer', async () => {
    const mockBuffer = Buffer.from('test content');
    const mockBlob = new Blob([mockBuffer]);

    (compareGcpeReports as jest.Mock).mockResolvedValue(mockBlob);

    const response = await request(app)
      .post('/api/reporting/gcpe/compare')
      .send({ sourceRowId: 1, targetRowId: 2 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Buffer));
    expect(response.body.toString()).toBe(mockBuffer.toString());
    expect(compareGcpeReports).toHaveBeenCalledWith(1, 2, expect.any(Object));
  });

  it('should regenerate a report and return a buffer', async () => {
    const mockBuffer = Buffer.from('test content');
    const mockBlob = new Blob([mockBuffer]);

    (regenerateGcpeReport as jest.Mock).mockResolvedValue(mockBlob);

    const response = await request(app)
      .post('/api/reporting/gcpe/regenerate')
      .send({ rowId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Buffer));
    expect(response.body.toString()).toBe(mockBuffer.toString());
    expect(regenerateGcpeReport).toHaveBeenCalledWith(1, expect.any(Object));
  });

  it('should compare and generate a GCPE report and return a buffer and rowId', async () => {
    const mockBuffer = Buffer.from('test content');
    const mockBlob = new Blob([mockBuffer]);

    (compareAndGenerateGcpeReport as jest.Mock).mockResolvedValue({
      blob: mockBlob,
      rowId: 2,
    });

    const response = await request(app)
      .post('/api/reporting/gcpe/generateAndCompare')
      .send({ rowId: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ buffer: expect.anything(), rowId: 2 });
    expect(compareAndGenerateGcpeReport).toHaveBeenCalledWith(
      1,
      expect.any(Object)
    );
  });
});
