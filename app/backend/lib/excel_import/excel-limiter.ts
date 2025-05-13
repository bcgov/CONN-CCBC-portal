import RateLimit from 'express-rate-limit';

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  // Max 20 connections per IP per window (1 minute)
  // This may seem like a lot for 1 user though we hit the api twice per upload,
  // once to validate and once to save so 10 uploads per minute is the max.
  max: 25,
});

export default limiter;
