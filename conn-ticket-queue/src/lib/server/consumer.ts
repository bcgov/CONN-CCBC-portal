import amqp from 'amqplib';
import { redis } from '$lib/server/redis';
import type { QueueMessage } from '$lib/types';

interface ProcessingMessage {
	channel: amqp.Channel;
	msg: amqp.ConsumeMessage;
	id: string;
}

let currentProcessingMessage: ProcessingMessage | null = null;

export async function startConsumer() {
	const connection = await amqp.connect('amqp://localhost');
	const channel = await connection.createChannel();
	const queue = 'task_queue';

	await channel.assertQueue(queue, { durable: true });

	console.log(' [*] Waiting for messages...');

	channel.consume(
		queue,
		async (msg) => {
			if (msg !== null) {
				const message: QueueMessage = JSON.parse(msg.content.toString());
				console.log(` [x] Received ${message.id}, waiting for completion...`);

				// Mark as "processing" in Redis
				await redis.set(`task:${message.id}`, 'processing');

				// Store reference to message
				currentProcessingMessage = { channel, msg, id: message.id };
			}
		},
		{ noAck: false }
	);
}

// Start the consumer
startConsumer();
