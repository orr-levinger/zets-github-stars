import { Auth } from "aws-amplify";
const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_7uSbGTXG5",
  aws_user_pools_web_client_id: "7rsi77q0tp8g33mr9bfr5l60k7",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  Auth: {
    identityPoolRegion: "us-east-1",
    userPoolId: "us-east-1_7uSbGTXG5",
    region: "us-east-1",
    userPoolWebClientId: "7rsi77q0tp8g33mr9bfr5l60k7",
  },
  API: {
    endpoints: [
      {
        name: "ZetsAPIGatewayAPI",
        endpoint: "https://j4xifu3w39.execute-api.us-east-1.amazonaws.com/dev",
        custom_header: async () => {
          let authorization = `${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`;
          return {
            Authorization: authorization,
          };
        },
      },
    ],
  },
};

export default awsmobile;
