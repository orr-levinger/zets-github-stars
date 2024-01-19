import { Auth } from 'aws-amplify';
const awsmobile = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_VVyEKTtDJ',
  aws_user_pools_web_client_id: '3llcoknaubstls8mtl2lgs67gv',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  Auth: {
    identityPoolRegion: 'us-east-1',
    userPoolId: 'us-east-1_VVyEKTtDJ',
    region: 'us-east-1',
    userPoolWebClientId: '3llcoknaubstls8mtl2lgs67gv',
  },
  API: {
    endpoints: [
      {
        name: 'ZetsAPIGatewayAPI',
        endpoint: 'https://9enycjhcti.execute-api.us-east-1.amazonaws.com/dev',
        custom_header: async () => {
          let authorization = `${(await Auth.currentSession()).getIdToken().getJwtToken()}`;
          return {
            Authorization: authorization,
          };
        },
      },
    ],
  },
};

export default awsmobile;
