import requests
import json
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def lambda_handler(event, context):
    url = "https://connectingcommunitiesbc.ca"
    result = fetch_and_check(url)
    if result == 0:
        return {
            'statusCode': 200,
            'body': json.dumps('All resources accessible')
        }
    else:
        raise Exception('Some resources are not accessible')


def fetch_and_check(url):
    # Fetch the main page
    response = requests.get(url)
    if response.status_code == 200:
        # Parse the page content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all resource links (e.g., link, script, img)
        resource_urls = []
        for link in soup.find_all('link', href=True):
            resource_urls.append(urljoin(url, link['href']))
        for script in soup.find_all('script', src=True):
            resource_urls.append(urljoin(url, script['src']))

        # Check each resource for 404
        for resource_url in resource_urls:
            res = requests.head(resource_url)  # Use HEAD to avoid downloading the content
            if res.status_code == 404:
                return 1
    else:
        return 1
    print('All resources are accessible')
    return 0
