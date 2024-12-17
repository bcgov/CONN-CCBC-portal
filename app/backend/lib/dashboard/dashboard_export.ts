import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import {
  generateApplicationData,
  generateCbcData,
  generateDashboardExport,
} from './dashboard';

const dashboardExport = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

dashboardExport.post('/api/dashboard/export', limiter, async (req, res) => {
  const cbcIds = req.body.cbc;
  const ccbcIds = req.body.ccbc;
  const applicationData = await generateApplicationData(ccbcIds, req);
  const cbcData = await generateCbcData(cbcIds, req);
  const blob = await generateDashboardExport(applicationData, cbcData);

  const buffer = Buffer.from(await blob.arrayBuffer());
  res.send(buffer);
});

export default dashboardExport;
