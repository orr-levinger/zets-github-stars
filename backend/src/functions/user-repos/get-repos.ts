import { APIGatewayProxyResult, Context } from 'aws-lambda';
import { repoService } from '@service/repo-service';

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
export const handler = async (event: any, context: Context) => {
  try {
    const claims = event.requestContext.authorizer.claims;
    const userId = claims.sub;
    const repos = await repoService.getUserRepos(userId);
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Header': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 200,
      body: JSON.stringify(repos), // Your response body
    };
  } catch (err) {
    console.error('Error', { error: err });
    return httpError(err, err.statusCode || 500);
  }
};