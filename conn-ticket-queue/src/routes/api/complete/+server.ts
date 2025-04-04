// api/complete/+server.ts
import { json } from '@sveltejs/kit';
import amqp from 'amqplib';
import { redis } from '$lib/server/redis';
import type { QueueMessage } from '$lib/types';

// api/complete/+server.ts (updated snippet)
export async function POST({ request }) {
	const { ref }: { ref: string } = await request.json();

	console.log('Webhook received - ref:', ref);

	// Validate that ref is of the form NDT-XXXX
	const refMatch = /^NDT-\d{3,4}/.exec(ref);
	if (!refMatch) {
		console.error('Invalid ref format:', ref);
		return json({ error: 'Invalid ref format' }, { status: 400 });
	}

	// Extract the full ref (e.g., NDT-1234)
	const validRef = refMatch[0];
	console.log('Validated ref:', validRef);

	const taskStatus = await redis.get(`task:${validRef}`);
	console.log('taskStatus:', taskStatus);

	try {
		const connection = await amqp.connect('amqp://localhost');
		const channel = await connection.createChannel();
		const queue = 'task_queue';

		await channel.assertQueue(queue, { durable: true });
		channel.prefetch(1);

		// Handle the current message
		const msg = await channel.get(queue, { noAck: false });
		if (msg) {
			const message: QueueMessage = JSON.parse(msg.content.toString());
			console.log(`Fetched message from queue: ${message.id}`);

			if (message.id === validRef && (taskStatus === 'processing' || taskStatus === 'pending')) {
				console.log(` [✓] Completing and acknowledging message ${validRef}`);
				channel.ack(msg);
				await redis.set(`task:${validRef}`, 'completed');
			} else {
				console.log(`Message ${message.id} does not match ${validRef} or not ready, requeueing...`);
				channel.nack(msg, true, true);
				if (taskStatus === 'completed') {
					console.log(`Message ${validRef} already completed`);
				}
				if (!taskStatus) {
					await channel.close();
					await connection.close();
					return json({ error: 'Message not found' }, { status: 400 });
				}
			}
		} else if (taskStatus === 'completed') {
			console.log(`Message ${validRef} already completed, no action needed`);
		} else {
			console.log('No messages in queue');
			await channel.close();
			await connection.close();
			return json({ error: 'No messages available' }, { status: 400 });
		}

		// Dequeue the next message
		const nextMsg = await channel.get(queue, { noAck: false });
		let nextMessage: QueueMessage;
		if (nextMsg) {
			nextMessage = JSON.parse(nextMsg.content.toString());
			const nextMessageId = nextMessage.id;
			console.log(`Automatically dequeued next message: ${nextMessageId}`);

			const nextStatus = await redis.get(`task:${nextMessageId}`);
			if (nextStatus === 'pending') {
				await redis.set(`task:${nextMessageId}`, 'processing');
				console.log(`Marked task:${nextMessageId} as processing`);
				// Start release process here
				channel.nack(nextMsg, true, true);
			} else {
				console.log(`Next message ${nextMessageId} in ${nextStatus} state, requeueing`);
				channel.nack(nextMsg, true, true);
			}
		} else {
			console.log('No more messages in queue to dequeue');
		}

		await channel.close();
		await connection.close();

		return json({
			status: taskStatus === 'completed' ? 'Already completed' : 'Message completed',
			next_message: nextMsg ? nextMessage?.id : null
		});
	} catch (error) {
		console.error('Error completing message:', error);
		return json({ error: 'Failed to process message' }, { status: 500 });
	}
}
