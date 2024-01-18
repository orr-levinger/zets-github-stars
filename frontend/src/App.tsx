import React, { useEffect, useState } from "react";
import { Amplify, API } from "aws-amplify";
import {
  AmplifyProvider,
  Authenticator,
  Button,
  Flex,
  Image,
  Text,
  View,
} from "@aws-amplify/ui-react";
import aws_exports from "./aws-exports";

import "@aws-amplify/ui-react/styles.css";
import theme from "./theme";
// @ts-ignore
import logo from "./logo.svg";

Amplify.configure(aws_exports);

const App = () => {
  const [repos, setRepos] = useState([]);

  const fetchRepos = async () => {
    try {
      const apiData = await API.get('ZetsAPIGatewayAPI', '/github/repos', {});
      setRepos(apiData);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  return (
      <AmplifyProvider theme={theme}>
        <Authenticator>
          {({ signOut, user }) => (
              <Flex
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="center"
                  alignContent="flex-start"
                  wrap="nowrap"
                  gap="1rem"
                  textAlign="center"
              >
                <View width="100%">
                  <Image src={logo} alt="logo" width={240} height={240} />
                </View>

                {user && (
                    <>
                      <View width="100%">
                        <Text>Hello {user.username}</Text>
                        <Button onClick={signOut}>
                          <Text>Sign Out</Text>
                        </Button>
                      </View>

                      <View width="100%">
                        <Button onClick={fetchRepos}>
                          <Text>Fetch Repos</Text>
                        </Button>
                      </View>

                      {repos.length > 0 && (
                          <View width="100%">
                            <Text>Repositories:</Text>
                            {repos.map((repo, index) => (
                                // @ts-ignore
                                <Text key={index}>{repo.name}</Text>
                            ))}
                          </View>
                      )}
                    </>
                )}

                <View width="100%">
                  <Text>
                    Edit <code>src/App.tsx</code> and save to reload.
                  </Text>
                </View>
              </Flex>
          )}
        </Authenticator>
      </AmplifyProvider>
  );
};

export default App;
