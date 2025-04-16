import { createHmac } from 'crypto';

/**
 * Verifies a GitHub webhook signature from a request
 * @param rawBody The raw body of the request as a string
 * @param signatureHeader The value of the X-Hub-Signature-256 header
 * @param secret Your GitHub webhook secret
 * @returns boolean indicating if the signature is valid
 * @throws Error if inputs are invalid
 */
export const verifyGitHubWebhook = (
	rawBody: string,
	signatureHeader: string,
	secret: string
): boolean => {
	if (!rawBody || typeof rawBody !== 'string') {
		throw new Error('Raw body must be a non-empty string');
	}
	if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
		throw new Error('Invalid or missing X-Hub-Signature-256 header');
	}
	if (!secret) {
		throw new Error('Webhook secret must be provided');
	}

	const computedSignature = createHmac('sha256', secret).update(rawBody).digest('hex');
	const expectedSignature = `sha256=${computedSignature}`;

	return Buffer.from(expectedSignature).equals(Buffer.from(signatureHeader));
};
