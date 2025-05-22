/**
 * @jest-environment node
 */
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import dashboardExport from '../../../../backend/lib/dashboard/dashboard_export';
import {
  generateApplicationData,
  generateCbcData,
  generateDashboardExport,
} from '../../../../backend/lib/dashboard/dashboard';

jest.mock('../../../../backend/lib/dashboard/dashboard');

describe('Dashboard export API', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use('/', dashboardExport);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a dashboard export and return a buffer', async () => {
    const mockBuffer = Buffer.from('test content');
    const mockBlob = new Blob([mockBuffer]);

    (generateApplicationData as jest.Mock).mockResolvedValue([mockBlob]);
    (generateCbcData as jest.Mock).mockResolvedValue([mockBlob]);
    (generateDashboardExport as jest.Mock).mockResolvedValue(mockBlob);

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ messages: [{ msgId: '123' }] }),
      })
    ) as jest.Mock;

    const response = await request(app)
      .post('/api/dashboard/export')
      .send({ cbc: [1], ccbc: [1] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Buffer));
    expect(response.body.toString()).toBe(mockBuffer.toString());
    expect(generateApplicationData).toHaveBeenCalledWith(
      [1],
      expect.any(Object)
    );
    expect(generateCbcData).toHaveBeenCalledWith([1], expect.any(Object));
    expect(generateDashboardExport).toHaveBeenCalledWith(
      [mockBlob],
      [mockBlob]
    );
  });
});
