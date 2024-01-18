import { APIGatewayProxyResult, Context } from 'aws-lambda';
const { Octokit } = require('@octokit/rest');
import { initSecret } from '../../lib/SSM';
let octokit;

const promise = initSecret('zets-github-token', 'GITHUB_TOKEN').then(() => {
  octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
});

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
    const response = await octokit.request('GET /search/repositories', {
      q: 'stars:>1',
      sort: 'stars',
      order: 'desc',
      per_page: pageSize,
      page,
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching data from GitHub API:', error);
    return [];
  }
}

type GetStaredReposResponse = {
  name: string;
  stars: number;
  id: string;
}[];
export const handler = async (event: any, context: Context) => {
  try {
    return promise.then(async () => {
      const page = Number(event.queryStringParameters?.page) || 1;
      const pageSize = Number(event.queryStringParameters?.pageSize) || 10;
      console.log(`Fetching page [${page}] and size [${pageSize}]`);
      const items = (await fetchRepositories(page, pageSize)).map((repo) => ({
        name: repo.full_name,
        stars: repo.stargazers_count,
        id: repo.id,
      }));
      console.log('items:', items);
      return {
        headers: {
          'Access-Control-Allow-Origin': '*', // Or a specific domain for production
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        statusCode: 200,
        body: JSON.stringify(items),
      };
    });
  } catch (err) {
    return httpError(err, err.statusCode || 500);
  }
};
