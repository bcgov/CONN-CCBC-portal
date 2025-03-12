// api/queue/+server.ts
import { json } from '@sveltejs/kit';
import amqp from 'amqplib';
import { redis } from '$lib/server/redis';
import type { QueueMessage } from '$lib/types';

export async function POST({ request }) {
	const { message_id, data } = await request.json();
	console.log('Webhook received - queueing message_id:', message_id);

	if (!message_id || !data) {
		return json({ error: 'Missing message_id or data' }, { status: 400 });
	}

	try {
		const connection = await amqp.connect('amqp://localhost');
		const channel = await connection.createChannel();
		const queue = 'task_queue';

		await channel.assertQueue(queue, { durable: true });

		const message: QueueMessage = { id: message_id, data };
		const messageBuffer = Buffer.from(JSON.stringify(message));

		// check if message is already in redis
		const taskStatus = await redis.get(`task:${message_id}`);
		if (taskStatus) {
			console.log(`Message ${message_id} already exists in queue`);
			return json({ error: 'Message already exists in queue' }, { status: 400 });
		}

		// check if there are other messages in the queue
		const msg = await channel.get(queue, { noAck: false });
		if (msg) {
			const nextMessage: QueueMessage = JSON.parse(msg.content.toString());
			console.log(`Next message in queue: ${nextMessage.id}`);
			// Mark as pending in Redis
			await redis.set(`task:${message_id}`, 'pending');
			console.log(`Marked task:${message_id} as pending`);
		} else {
			console.log('No messages in queue');

			// Mark as processing in Redis
			await redis.set(`task:${message_id}`, 'processing');
			console.log(`Marked task:${message_id} as processing as queue is empty`);
			// start release process
		}

		channel.sendToQueue(queue, messageBuffer, { persistent: true });
		console.log(` [>] Queued message ${message_id}`);

		await channel.close();
		await connection.close();

		return json({ status: 'Message queued', message_id });
	} catch (error) {
		console.error('Queue error:', error);
		return json({ error: 'Failed to queue message' }, { status: 500 });
	}
}
