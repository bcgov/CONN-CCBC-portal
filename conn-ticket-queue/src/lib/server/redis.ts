import Redis from 'ioredis';

// Get Redis connection details from environment variables
const redisHost = process.env.REDIS_HOST || '127.0.0.1'; // Default to localhost
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10); // Default to port 6379
const redisPassword = process.env.REDIS_PASSWORD || undefined; // Optional password

export const redis = new Redis({
	host: redisHost,
	port: redisPort,
	password: redisPassword
});
