import {APIGatewayProxyResult, Context} from 'aws-lambda';
import axios from 'axios';

const GITHUB_TOKEN = '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'; // Replace with your GitHub token
const GITHUB_API_URL = 'https://api.github.com';

const PER_PAGE = 10; // Max number of items per page

export const httpError = (err: Error, status: number): APIGatewayProxyResult => {
  return {
    statusCode: status || 500,
    body: JSON.stringify(err),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Header': '*',
    },
  };
};
async function fetchRepositories(page: number, pageSize: number) {
  try {
    const response = await axios.get(`${GITHUB_API_URL}/search/repositories`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
      params: { q: 'stars:>1', sort: 'stars', order: 'desc', per_page: pageSize, page }
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    return [];
  }
}

export const handler = async (event: any, context: Context) => {
  try {
    console.log('event', event);
    const page = Number(event.queryStringParameters?.page) || 1;
    const pageSize = Number(event.queryStringParameters?.pageSize) || 10;
    const items = (await fetchRepositories(page, pageSize)).map(repo =>({
      name: repo.full_name,
      stars: repo.stargazers_count
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(items),
    };
  } catch (err) {
    return httpError(err, err.statusCode || 500);
  }
};
