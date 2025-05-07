import axios, { type AxiosResponse } from 'axios';

// Define custom error class for better error handling
class GitHubAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number
	) {
		super(message);
		this.name = 'GitHubAPIError';
	}
}

// Interfaces for GitHub API responses
interface GitHubSearchResponse {
	items: Array<{
		url: string;
	}>;
}

interface PRDetails {
	body: string;
}

const findPrByPartialBranch = async (
	repoOwner: string,
	repoName: string,
	branchName: string
): Promise<{ cleanedItems: Array<any>; prApiUrl: string | null }> => {
	try {
		const response = await axios.get<GitHubSearchResponse>(
			`https://api.github.com/search/issues?q=repo:${repoOwner}/${repoName}+head:${branchName}+is:pr`,
			{
				headers: { Accept: 'application/vnd.github.v3+json' }
			}
		);

		const cleanedResponse = {
			...response.data,
			items: response.data.items.map((item) => ({
				...item,
				url: item.url.replace(/[\u0000-\u001F\u007F]/g, '')
			}))
		};

		const prApiUrl = cleanedResponse.items.at(0)?.url;
		if (!prApiUrl) {
			return {
				cleanedItems: [],
				prApiUrl: null
			};
		}

		return { cleanedItems: cleanedResponse.items, prApiUrl: prApiUrl };
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new GitHubAPIError(
				'Failed to retrieve PRs: Repository or branch not found',
				error.response?.status
			);
		}
		throw new GitHubAPIError(`Error processing response: ${error}`);
	}
};

const updatePrDescription = async (prUrl: string, token: string): Promise<void> => {
	const headers = {
		Accept: 'application/vnd.github.v3+json',
		Authorization: `Bearer ${token}`
	};

	try {
		const response = await axios.get<PRDetails>(prUrl, { headers });
		const { body } = response.data;

		const checkedCheckbox = '- [x] Check to trigger automatic release process';
		if (body.includes(checkedCheckbox)) {
			return;
		}

		const existingCheckbox = '- [ ] Check to trigger automatic release process';
		const newDescription = body.replace(existingCheckbox, checkedCheckbox);

		const updateResponse = await axios.patch<unknown>(prUrl, { body: newDescription }, { headers });

		if (updateResponse.status !== 200) {
			throw new GitHubAPIError(`Failed to update PR description`, updateResponse.status);
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new GitHubAPIError(`Failed to retrieve/update PR details`, error.response?.status);
		}
		throw new GitHubAPIError(`Error updating PR description: ${error}`);
	}
};

export const checkHeaderSecret = (passedValue: string): boolean => {
	const headerSecret = process.env.JIRA_WEBHOOK_SECRET;
	if (!headerSecret) {
		throw new GitHubAPIError('HEADER_SECRET environment variable is not set');
	}
	return passedValue === headerSecret;
};

export const updatePRForRelease = async ({
	repoOwner,
	repoName,
	branchName,
	passedHeader,
	token = process.env.GITHUB_TOKEN
}: {
	repoOwner: string;
	repoName: string;
	branchName: string;
	passedHeader: string;
	token?: string;
}): Promise<{ repoOwner: string; repoName: string }> => {
	if (!token) {
		throw new GitHubAPIError(
			'GitHub token is required either as parameter or GITHUB_TOKEN environment variable'
		);
	}

	if (!checkHeaderSecret(passedHeader)) {
		throw new GitHubAPIError('Invalid header secret');
	}

	const pr = await findPrByPartialBranch(repoOwner, repoName, branchName);
	const prUrl = pr.prApiUrl;
	await updatePrDescription(prUrl, token);

	const parts = prUrl.split('/');
	return {
		repoOwner: parts.at(4) ?? repoOwner,
		repoName: parts.at(5) ?? repoName
	};
};

export const isPrOpenAndExists = async (
	repoOwner: string,
	repoName: string,
	branchName: string
): Promise<boolean> => {
	const pr = await findPrByPartialBranch(repoOwner, repoName, branchName);
	if (!pr.cleanedItems.length) {
		return false;
	}
	// Check if any of the PRs are open
	return pr.cleanedItems.some((item) => {
		console.log('item,', item);
		return item.state === 'open';
	});
};
