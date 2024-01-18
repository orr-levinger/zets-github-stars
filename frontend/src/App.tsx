import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { Amplify, API } from 'aws-amplify';
import {
  AmplifyProvider,
  Authenticator,
  Button,
  Flex,
  Image,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import aws_exports from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import theme from './theme';
// @ts-ignore
import logo from './logo.svg';

Amplify.configure(aws_exports);

// Create a client
const queryClient = new QueryClient();

type Repo = {
  name: string;
  stars: number;
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Stars',
    dataIndex: 'stars',
    key: 'stars',
    sorter: (a: Repo, b: Repo) => a.stars - b.stars,
  },
];

// @ts-ignore
const AppContent = ({ signOut, user }) => {
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching page ${currentPage} and size: ${pageSize}`);
      const newRepos = await API.get(
        'ZetsAPIGatewayAPI',
        `/github/repos?page=${currentPage}&pageSize=${pageSize}`,
        {}
      );
      // @ts-ignore
      setRepos((prevRepos) => [...prevRepos, ...newRepos]);
      console.log(
        `new repos are:`,
        // @ts-ignore
        repos.map((repo) => repo.name)
      );
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRepos();
  }, []);

  return (
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
            <Button onClick={fetchRepos} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Next'}
            </Button>
          </View>

          <View width="100%">
            <Table dataSource={repos} columns={columns} rowKey="name" pagination={false} />
          </View>
        </>
      )}

      <View width="100%">
        <Text>
          Edit <code>src/App.tsx</code> and save to reload.
        </Text>
      </View>
    </Flex>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AmplifyProvider theme={theme}>
        <Authenticator>
          {({ signOut, user }) => <AppContent signOut={signOut} user={user} />}
        </Authenticator>
      </AmplifyProvider>
    </QueryClientProvider>
  );
};

export default App;
