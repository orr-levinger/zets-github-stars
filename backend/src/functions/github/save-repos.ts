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
        'Access-Control-Allow-Origin': '*', // Or a specific domain for production
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      statusCode: 201,
    };
  } catch (err) {
    return httpError(err, err.statusCode || 500);
  }
};
