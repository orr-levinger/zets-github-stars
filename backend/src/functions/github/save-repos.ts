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
        'Access-Control-Allow-Origin': '*', // Replace with specific domain in production
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with', // Add other needed headers
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Add other needed methods
      },
      statusCode: 201,
      body: JSON.stringify({ message: 'Success' }), // Your response body
    };
  } catch (err) {
    return httpError(err, err.statusCode || 500);
  }
};
