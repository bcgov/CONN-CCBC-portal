// api/complete/+server.ts
import { json } from '@sveltejs/kit';
import amqp from 'amqplib';
import { redis } from '$lib/server/redis';
import type { QueueMessage } from '$lib/types';

// api/complete/+server.ts (updated snippet)
export async function POST({ request }) {
	const { message_id }: { message_id: string } = await request.json();
	console.log('Webhook received - message_id:', message_id);

	const taskStatus = await redis.get(`task:${message_id}`);
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

			if (message.id === message_id && (taskStatus === 'processing' || taskStatus === 'pending')) {
				console.log(` [✓] Completing and acknowledging message ${message_id}`);
				channel.ack(msg);
				await redis.set(`task:${message_id}`, 'completed');
			} else {
				console.log(
					`Message ${message.id} does not match ${message_id} or not ready, requeueing...`
				);
				channel.nack(msg, true, true);
				if (taskStatus === 'completed') {
					console.log(`Message ${message_id} already completed`);
				}
				if (!taskStatus) {
					await channel.close();
					await connection.close();
					return json({ error: 'Message not found' }, { status: 400 });
				}
			}
		} else if (taskStatus === 'completed') {
			console.log(`Message ${message_id} already completed, no action needed`);
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
