import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Table, Checkbox } from 'antd';
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
  id: number;
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
  const [repos, setRepos] = useState<Map<number, Repo>>(new Map());
  const [savedRepos, setSavedRepos] = useState<Map<number, Repo>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const onRowSelected = (newSelectedRowKeys: React.Key[]) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const pageSize = 25;

  const handleSaveSelectedRows = async () => {
    // Gather selected repositories using direct access from the Map
    const selectedRepos = selectedRowKeys
      .map((key) => repos.get(Number(key)))
      .filter((repo) => repo !== undefined);

    // Call API to save the selected repositories
    try {
      const response = await API.post('ZetsAPIGatewayAPI', `/user/repos`, {
        body: selectedRepos,
      });
      console.log('Save response:', response);
    } catch (error) {
      console.error('Error saving selected repos:', error);
    }
  };

  const loadSavedRepos = async () => {
    try {
      const response: Repo[] = await API.get('ZetsAPIGatewayAPI', `/user/repos`, {});
      const mappedRepos = new Map(response.map((repo) => [repo.id, repo]));
      setSavedRepos(mappedRepos);
      console.log('Save response:', response);
    } catch (error) {
      console.error('Error saving selected repos:', error);
    }
  };

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      console.log(`Fetching page ${currentPage} and size: ${pageSize}`);
      const newRepos: Repo[] = await API.get(
        'ZetsAPIGatewayAPI',
        `/github/repos?page=${currentPage}&pageSize=${pageSize}`,
        {}
      );
      const mappedRepos = new Map(newRepos.map((repo) => [repo.id, repo]));
      setRepos((prevRepos) => new Map([...prevRepos, ...mappedRepos]));
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelected,
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
            <Button
              onClick={handleSaveSelectedRows}
              disabled={isLoading || selectedRowKeys.length === 0}
            >
              Save Selected
            </Button>
          </View>
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
            <Table
              rowSelection={rowSelection}
              dataSource={Array.from(repos.values())}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
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
