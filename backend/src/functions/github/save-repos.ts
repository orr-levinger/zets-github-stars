import { APIGatewayProxyResult, Context } from 'aws-lambda';

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
    console.log('items:', event);
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Header': '*',
        'Access-Control-Allow-Methods': '*',
      },
      statusCode: 201,
      body: JSON.stringify({ message: 'Success' }), // Your response body
    };
  } catch (err) {
    return httpError(err, err.statusCode || 500);
  }
};
