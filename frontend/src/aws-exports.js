import { Auth } from "aws-amplify";
const awsmobile = {
  aws_project_region: "us-east-1",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_tzCuLJmUL",
  aws_user_pools_web_client_id: "34ekv29pnb7s8mcmp99dp8p5n7",
  aws_appsync_graphqlEndpoint:
    "https://nv4mtc2kefc5jgcfxb2vwyul2e.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
  Auth: {
    identityPoolRegion: "us-east-1",
    userPoolId: "us-east-1_tzCuLJmUL",
    region: "us-east-1",
    userPoolWebClientId: "34ekv29pnb7s8mcmp99dp8p5n7",
  },
  API: {
    endpoints: [
      {
        name: "ZetsAPIGatewayAPI",
        endpoint: "https://a3eqzyp0wc.execute-api.us-east-1.amazonaws.com/prod",
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
