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
    console.log('event', JSON.stringify(event, null, 2));
    const claims = event.requestContext.authorizer.claims;
    const userId = claims.sub;
    console.log('ids:', JSON.parse(event.body));
    await repoService.deleteRepos(userId, JSON.parse(event.body) as number[]);
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Header': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 201,
      body: JSON.stringify({ message: 'Success' }),
    };
  } catch (err) {
    console.error('Error', { error: err });
    return httpError(err, err.statusCode || 500);
  }
};
