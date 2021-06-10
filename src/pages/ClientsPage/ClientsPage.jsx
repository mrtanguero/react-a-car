import { Button, Card, PageHeader, Space, Table } from 'antd';
import React, { useContext, useRef } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import NewClientForm from '../../components/NewClientForm/NewClientForm';
import { getClients } from '../../services/clients';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 180,
  },
  {
    title: 'Country',
    dataIndex: ['country', 'name'],
    key: 'country',
    width: 150,
  },
  {
    title: 'ID document number',
    dataIndex: 'identification_document_no',
    key: 'document-id',
    width: 150,
    ellipsis: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 200,
  },
  {
    title: 'Phone',
    dataIndex: 'phone_no',
    key: 'phone',
    width: 150,
  },
  {
    title: 'Actions',
    key: 'action',
    align: 'center',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        <Button
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            console.log(record.id);
          }}
        />
        <Button icon={<DeleteOutlined />} danger />
      </Space>
    ),
  },
];

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);
  const { t } = useTranslation();

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('clients', getClients, {
    getNextPageParam: (lastPage, pages) => {
      const isLastPage = lastPage.data.current_page === lastPage.data.last_page;
      return isLastPage ? false : lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
    // onSuccess: () => console.log('Response: ', response),
  });

  const loadMoreRef = useRef();

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newClient'),
      children: <NewClientForm />,
      onOk: () => {},
      onCancel: handleCancelModal,
    });
  };

  if (error) console.log(error.response);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.clients')}
        extra={
          <Button onClick={handleClick}>
            <UserAddOutlined />
            {t('buttons.newClient')}
          </Button>
        }
      />
      <Card>
        <Table
          loading={!response?.pages.length && isFetching}
          columns={columns}
          dataSource={
            [].concat.apply(
              [],
              response?.pages.map((page) => page.data.data)
            ) || []
          }
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: '100%', y: '400px' }}
          size="small"
          footer={() => (
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? 'Loading more...'
                : hasNextPage
                ? 'Load More'
                : 'Nothing more to load'}
            </Button>
          )}
          onRow={(record, index) => {
            return {
              onClick: () => {
                console.log('Ref bound to: ', loadMoreRef.current);
              },
              ref:
                index ===
                response.pages.reduce(
                  (sum, cur) => sum + cur.data.data.length,
                  0
                ) -
                  1
                  ? loadMoreRef
                  : null,
            };
          }}
        />
      </Card>
    </>
  );
}
