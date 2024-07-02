import { Router } from 'express';
import RateLimit from 'express-rate-limit';
import {
  compareAndGenerateGcpeReport,
  compareGcpeReports,
  generateGcpeReport,
  regenerateGcpeReport,
} from './gcpe';

const reporting = Router();

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 2000,
});

reporting.get('/api/reporting/gcpe', limiter, async (req, res) => {
  const blob = await generateGcpeReport(req);
  // Convert blob to buffer
  const buffer = Buffer.from(await blob.arrayBuffer());
  res.send(buffer);
});

reporting.post('/api/reporting/gcpe/regenerate', limiter, async (req, res) => {
  const { rowId } = req.body;
  const blob = await regenerateGcpeReport(rowId, req);
  // Convert blob to buffer
  const buffer = Buffer.from(await blob.arrayBuffer());
  res.send(buffer);
});

reporting.post(
  '/api/reporting/gcpe/generateAndCompare',
  limiter,
  async (req, res) => {
    const { rowId } = req.body;
    const blob = await compareAndGenerateGcpeReport(rowId, req);
    // Convert blob to buffer
    const buffer = Buffer.from(await blob.arrayBuffer());
    res.send(buffer);
  }
);

reporting.post('/api/reporting/gcpe/compare', limiter, async (req, res) => {
  const { sourceRowId, targetRowId } = req.body;
  const blob = await compareGcpeReports(sourceRowId, targetRowId, req);
  // Convert blob to buffer
  const buffer = Buffer.from(await blob.arrayBuffer());
  res.send(buffer);
});

export default reporting;
