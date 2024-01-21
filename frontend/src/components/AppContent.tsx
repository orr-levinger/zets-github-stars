import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Button, Table } from 'antd';
import useRepositories from '../hooks/useRepositories';
import { Repo } from '../types/Repo';

// @ts-ignore
const AppContent = ({ signOut, user }) => {
  const {
    repos,
    savedRepos,
    isGithubLoading,
    isSavingLoading,
    isDeletingLoading,
    fetchRepos,
    loadSavedRepos,
    saveSelectedRepos,
    deleteSelectedRepos,
  } = useRepositories();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedSavedRowKeys, setSelectedSavedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    fetchRepos();
    loadSavedRepos();
  }, [fetchRepos, loadSavedRepos]);

  const handleSaveSelectedRows = () => {
    saveSelectedRepos(selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const handleDeleteSelectedRows = () => {
    deleteSelectedRepos(selectedSavedRowKeys);
    setSelectedSavedRowKeys([]);
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'avatarUrl',
      key: 'avatarUrl',
      render: (text: string, record: Repo) => (
        <img src={record.avatarUrl} alt={record.name} width={32} height={32} />
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

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const rowSavedSelection = {
    selectedRowKeys: selectedSavedRowKeys,
    onChange: setSelectedSavedRowKeys,
  };

  return (
    <Layout>
      <Layout.Header>
        <Row>
          <Col span={12}>
            <Button onClick={signOut}>Sign Out</Button>
          </Col>
          <Col span={12}>{/* Additional header content */}</Col>
        </Row>
      </Layout.Header>
      <Layout.Content>
        {user && (
          <>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Button
                  loading={isSavingLoading}
                  type="primary"
                  onClick={handleSaveSelectedRows}
                  disabled={selectedRowKeys.length === 0}
                >
                  Save Selected Repos
                </Button>
                <Button loading={isGithubLoading} onClick={fetchRepos}>
                  Load More Repos
                </Button>
                <Table
                  rowSelection={rowSelection}
                  dataSource={Array.from(repos.values())}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                />
              </Col>
              <Col span={12}>
                <Button
                  loading={isDeletingLoading}
                  onClick={handleDeleteSelectedRows}
                  disabled={selectedSavedRowKeys.length === 0}
                >
                  Delete Selected Repos
                </Button>
                <Table
                  rowSelection={rowSavedSelection}
                  dataSource={Array.from(savedRepos.values())}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: true }}
                />
              </Col>
            </Row>
          </>
        )}
      </Layout.Content>
      <Layout.Footer>The Best Git Stars Ranking View In The Universe</Layout.Footer>
    </Layout>
  );
};

export default AppContent;
