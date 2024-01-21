import { repoService } from '@service/repo-service';
import { httpError, httpResponse } from '@common/http-response';
import { APIGatewayEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayEvent) => {
  try {
    const claims = event.requestContext.authorizer.claims;
    const userId = claims.sub;
    const repos = await repoService.getUserRepos(userId);
    return httpResponse(repos, 200);
  } catch (err) {
    console.error('Error', { error: err });
    return httpError(err, err.statusCode || 500);
  }
};
