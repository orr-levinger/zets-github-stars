import React, { useState, useEffect } from 'react';
import { Table, Layout, Row, Col, Button } from 'antd';
import './index.css';
import { Amplify, API } from 'aws-amplify';
import { AmplifyProvider, Authenticator, Image } from '@aws-amplify/ui-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import aws_exports from './aws-exports';

import '@aws-amplify/ui-react/styles.css';
import theme from './theme';
// @ts-ignore
import logo from './github.svg';
const { Header, Footer, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  paddingInline: 10,
  lineHeight: '55px',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 60,
  lineHeight: '60px',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  margin: 'auto',
};

Amplify.configure(aws_exports);

// Create a client
const queryClient = new QueryClient();

type Repo = {
  name: string;
  stars: number;
  id: number;
  repositoryUrl: string;
  avatarUrl: string;
};

const PAGE_SIZE = 25;

const columns = [
  {
    title: 'Logo',
    dataIndex: 'avatarUrl',
    key: 'avatarUrl',
    render: (text: string, record: Repo) => (
      <img src={record.avatarUrl} alt={record.avatarUrl ? '' : 'logo.svg'} width={32} height={32} />
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: Repo) => (
      <a href={record.repositoryUrl} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
  },
  {
    title: 'Stars ⭐',
    dataIndex: 'stars',
    key: 'stars',
    sorter: (a: Repo, b: Repo) => a.stars - b.stars,
    render: (text: string, record: Repo) => `${(record.stars / 1000).toFixed(1)}K ⭐`,
  },
];

// @ts-ignore
const AppContent = ({ signOut, user }) => {
  const [repos, setRepos] = useState<Map<number, Repo>>(new Map());
  const [savedRepos, setSavedRepos] = useState<Map<number, Repo>>(new Map());
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedSavedRowKeys, setSelectedSavedRowKeys] = useState<React.Key[]>([]);
  const onRowSelected = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onSavedRowSelected = (newSelectedRowKeys: React.Key[]) => {
    setSelectedSavedRowKeys(newSelectedRowKeys);
  };

  const handleSaveSelectedRows = async () => {
    // Gather selected repositories using direct access from the Map
    const selectedRepos = selectedRowKeys
      .map((key) => repos.get(Number(key)))
      .filter((repo) => repo !== undefined);

    // Call API to save the selected repositories
    try {
      setIsSavingLoading(true);
      const response = await API.post('ZetsAPIGatewayAPI', `/user/repos`, {
        body: selectedRepos,
      });
      loadSavedRepos();
      console.log('Save response:', response);
    } catch (error) {
      console.error('Error saving selected repos:', error);
    } finally {
      setIsSavingLoading(false);
    }
  };

  const handleDeleteSelectedRows = async () => {
    try {
      setIsDeletingLoading(true);
      const response = await API.del('ZetsAPIGatewayAPI', `/user/repos`, {
        body: selectedSavedRowKeys,
      });
      loadSavedRepos();
      setSelectedSavedRowKeys([]);
      console.log('Save response:', response);
    } catch (error) {
      console.error('Error saving selected repos:', error);
    } finally {
      setIsDeletingLoading(false);
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
    setIsGithubLoading(true);
    try {
      const newRepos: Repo[] = await API.get(
        'ZetsAPIGatewayAPI',
        `/github/repos?page=${currentPage}&pageSize=${PAGE_SIZE}`,
        {}
      );
      const mappedRepos = new Map(newRepos.map((repo) => [repo.id, repo]));
      setRepos((prevRepos) => new Map([...prevRepos, ...mappedRepos]));
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching repos:', error);
    } finally {
      setIsGithubLoading(false);
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelected,
  };
  const rowSavedSelection = {
    selectedSavedRowKeys,
    onChange: onSavedRowSelected,
  };
  // Initial fetch
  useEffect(() => {
    fetchRepos();
    loadSavedRepos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Row>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Button onClick={signOut}>Sign Out</Button>
          </Col>
          <Col xs={0} sm={8} md={12} lg={16}></Col>
          <Col xs={24} sm={8} md={6} lg={4}>
            <Image src={logo} alt="logo" width={50} height={50} />
          </Col>
        </Row>
      </Header>
      <Content style={contentStyle}>
        {user && (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Button
                loading={isSavingLoading}
                type={'primary'}
                onClick={handleSaveSelectedRows}
                disabled={selectedRowKeys.length === 0}
              >
                Save repos
              </Button>
              <Button loading={isGithubLoading} onClick={fetchRepos}>
                Next
              </Button>
              <Table
                pagination={{
                  pageSize: 12,
                }}
                size="small"
                rowSelection={rowSelection}
                dataSource={Array.from(repos.values())}
                columns={columns}
                rowKey="id"
                scroll={{ x: true }}
              />
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Button
                loading={isDeletingLoading}
                onClick={handleDeleteSelectedRows}
                disabled={isDeletingLoading || selectedSavedRowKeys.length === 0}
              >
                Delete
              </Button>
              <Table
                pagination={{
                  pageSize: 12,
                }}
                size="small"
                rowSelection={rowSavedSelection}
                dataSource={Array.from(savedRepos.values())}
                columns={columns}
                rowKey="id"
                scroll={{ x: true }}
              />
            </Col>
          </Row>
        )}
      </Content>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
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
