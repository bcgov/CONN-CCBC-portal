import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import {
  generateApplicationData,
  generateCbcData,
  generateDashboardExport,
} from './dashboard';
import sendEmail from '../ches/sendEmail';
import getAccessToken from '../ches/getAccessToken';

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
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  // Email functionality
  const token = await getAccessToken();
  // Convert blob to base64 string for email attachment
  const base64String = buffer.toString('base64');
  await sendEmail(
    token,
    'Dashboard export generated',
    'Dashboard Export',
    ['nwbc.devinbox@gov.bc.ca'],
    'ccbc-dashboard-export',
    [],
    [
      {
        content: base64String,
        filename: 'dashboard_export.xlsx',
        encoding: 'base64',
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ]
  );
  res.send(buffer);
});

export default dashboardExport;
