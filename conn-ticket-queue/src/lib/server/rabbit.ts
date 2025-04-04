// Get AMQP connection details from environment variables
const amqpHost = process.env.AMQP_HOST || 'localhost';
const amqpPort = process.env.AMQP_PORT || '5672';
const amqpUser = process.env.AMQP_USER || 'guest';
const amqpPassword = process.env.AMQP_PASSWORD || 'guest';
export const amqpUrl = `amqp://${amqpUser}:${amqpPassword}@${amqpHost}:${amqpPort}`;
