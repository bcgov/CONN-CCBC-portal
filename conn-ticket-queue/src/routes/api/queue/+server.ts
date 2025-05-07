// api/queue/+server.ts
import { json } from '@sveltejs/kit';
import amqp from 'amqplib';
import { redis } from '$lib/server/redis';
import type { QueueMessage } from '$lib/types';
import { amqpUrl } from '$lib/server/rabbit';
import { updatePRForRelease, isPrOpenAndExists } from '$lib/merge';

const JIRA_WEBHOOK_SECRET = process.env.JIRA_WEBHOOK_SECRET || '';

export async function POST({ request }) {
	const { key } = await request.json();
	console.log('Webhook received - queueing key:', key);

	if (!key) {
		return json({ error: 'Missing key' }, { status: 400 });
	}

	const repoName = 'CONN-CCBC-portal';
	const repoOwner = 'bcgov';
	const branchName = key;

	// check if a pr exists for the key and it is open
	const prExistsAndOpen = await isPrOpenAndExists(repoOwner, repoName, branchName);
	console.log('PR exists and is open:', prExistsAndOpen);
	if (!prExistsAndOpen) {
		console.log(`No open PR exists for branch ${branchName}`);
		return json({ error: 'No open PR exists for the specified branch' }, { status: 404 });
	}

	const data = 'sprint_done';

	try {
		const secret = request.headers.get('ccbc-jira-header');
		if (!secret) {
			return json({ error: 'Missing CCBC-JIRA-Header' }, { status: 400 });
		}
		if (secret !== JIRA_WEBHOOK_SECRET) {
			return json({ error: 'Invalid CCBC-JIRA-Header' }, { status: 403 });
		}
		const connection = await amqp.connect(amqpUrl);
		const channel = await connection.createChannel();
		const queue = 'task_queue';

		await channel.assertQueue(queue, { durable: true });

		const message: QueueMessage = { id: key, data };
		const messageBuffer = Buffer.from(JSON.stringify(message));

		// check if message is already in redis
		const taskStatus = await redis.get(`task:${key}`);
		if (taskStatus) {
			console.log(`Message ${key} already exists in queue`);
			return json({ error: 'Message already exists in queue' }, { status: 400 });
		}

		// check if there are other messages in the queue
		const msg = await channel.get(queue, { noAck: false });
		if (msg) {
			const nextMessage: QueueMessage = JSON.parse(msg.content.toString());
			console.log(`Next message in queue: ${nextMessage.id}`);
			// Mark as pending in Redis
			await redis.set(`task:${key}`, 'pending');
			console.log(`Marked task:${key} as pending`);
		} else {
			console.log('No messages in queue');

			// Mark as processing in Redis
			await redis.set(`task:${key}`, 'processing');
			console.log(`Marked task:${key} as processing as queue is empty`);
			// start release process

			const passedHeader = secret;
			const result = await updatePRForRelease({ repoOwner, repoName, branchName, passedHeader });
			console.log('Release process result:', result);
		}

		channel.sendToQueue(queue, messageBuffer, { persistent: true });
		console.log(` [>] Queued message ${key}`);

		await channel.close();
		await connection.close();

		return json({ status: 'Message queued', key });
	} catch (error) {
		console.error('Queue error:', error);
		return json({ error: 'Failed to queue message' }, { status: 500 });
	}
}
