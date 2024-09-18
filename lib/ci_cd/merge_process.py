import sys
import json
import os
import requests

def find_pr_by_partial_branch(repo_owner, repo_name, branch_name):
    # Make a GET request to the GitHub API with a partial branch name
    response = requests.get(f"https://api.github.com/search/issues?q=repo:{repo_owner}/{repo_name}+head:{branch_name}+is:pr")

    # Check if the request was successful
    if response.status_code != 200:
        print("Failed to retrieve PRs: Repository or branch not found.")
        sys.exit(1)

    try:
        # Convert response text to JSON
        data = response.json()
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON response: {e}")
        sys.exit(1)

    # Filter out control characters from the JSON response
    cleaned_response = {k: v.translate({0: None, 127: None}) if isinstance(v, str) else v for k, v in data.items()}

    # Extract the URL of the first pull request (if any)
    try:
        pr_api_url = cleaned_response["items"][0]["url"]
    except (KeyError, IndexError):
        print("No PR found for the specified branch.")
        sys.exit(1)

    if pr_api_url:
        return pr_api_url
    else:
        print("No PR found for the specified branch.")

def update_pr_description(pr_url, token):
    # Get the PR details
    headers = {"Accept": "application/vnd.github.v3+json", "Authorization": f"token {token}"}
    response = requests.get(pr_url, headers=headers)

    if response.status_code != 200:
        print(f"Failed to retrieve PR details: {response.status_code}")
        return

    pr_details = response.json()

    # Check if the PR body already contains the checkbox
    checked_checkbox = "- [x] Check to trigger automatic release process"
    if checked_checkbox in pr_details["body"]:
        print("Checkbox already exists in the PR description.")
    else:
        # Update the PR description
        existing_checkbox = "- [ ] Check to trigger automatic release process"
        new_description = pr_details["body"].replace(existing_checkbox, "- [x] Check to trigger automatic release process")
        pr_details["body"] = new_description

        # Send the updated PR details
        response = requests.patch(pr_url, headers=headers, json={"body": new_description})

        if response.status_code == 200:
            print("PR description updated successfully!")
        else:
            print(f"Failed to update PR description: {response.status_code}")

def get_pull_request_id(pr_url, token):
    # Extract pull request number from the URL
    pr_number = pr_url.split("/")[-1]

    # GraphQL query to get pull request ID
    query = """
    query GetPullRequestID {
        repository(owner: "%s", name: "%s") {
            pullRequest(number: %s) {
                id
            }
        }
    }
    """ % (repo_owner, repo_name, pr_number)

    # Send GraphQL request
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post("https://api.github.com/graphql", json={"query": query}, headers=headers)

    if response.status_code != 200:
        print(f"Failed to retrieve pull request ID: {response.status_code}")
        return None

    data = response.json()
    pull_request_id = data.get("data", {}).get("repository", {}).get("pullRequest", {}).get("id")
    return pull_request_id

def enable_auto_merge(pull_request_id, token):
    # GraphQL mutation to enable auto merge
    mutation = """
    mutation EnableAutoMerge {
        enablePullRequestAutoMerge(input: {pullRequestId: "%s", mergeMethod: MERGE}) {
            clientMutationId
        }
    }
    """ % pull_request_id

    # Send GraphQL request
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post("https://api.github.com/graphql", json={"query": mutation}, headers=headers)

    if response.status_code != 200:
        print(f"Failed to enable auto merge: {response.status_code}")
        return

    print("Auto merge enabled successfully!")

def check_header_secret(passed_value):
    # Get the value of the environment variable named HEADER_SECRET
    header_secret = os.environ.get('HEADER_SECRET')

    # Check if passed_value is equal to expected header_secret
    if passed_value == header_secret:
        return True
    else:
        return False

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python script.py <repo_owner> <repo_name> <branch_name> <passed_header>")
        sys.exit(1)

    repo_owner = sys.argv[1]
    repo_name = sys.argv[2]
    branch_name = sys.argv[3]
    passed_header = sys.argv[4]
    token = os.environ.get('GITHUB_TOKEN')

    if not check_header_secret(passed_header):
        print("Invalid header secret.")
        sys.exit(1)

    print(repo_owner, repo_name, branch_name, passed_header, token)

    pr_url = find_pr_by_partial_branch(repo_owner, repo_name, branch_name)

    update_pr_description(pr_url, token)

    parts = pr_url.split("/")
    repo_owner = parts[4]
    repo_name = parts[5]

    pull_request_id = get_pull_request_id(pr_url, token)
    if pull_request_id:
        enable_auto_merge(pull_request_id, token)
