import { Button, PageHeader, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import { UserAddOutlined } from '@ant-design/icons';
import NewClientForm from '../../components/NewClientForm/NewClientForm';
import { getClients } from '../../services/clients';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Country',
    dataIndex: ['country', 'name'],
    key: 'country',
  },
  {
    title: 'ID document number',
    dataIndex: 'id_document_number',
    key: 'document-id',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
];

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);
  const [allData, setAllData] = useState([]);
  const { t } = useTranslation();

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery('clients', getClients, {
    getNextPageParam: (lastPage, pages) => {
      console.log('Last page: ', lastPage);
      console.log('Returning...', lastPage.data.current_page);
      return lastPage.data.current_page + 1;
    },
  });

  useEffect(() => {
    if (status === 'success') {
      setAllData((oldData) => [
        ...oldData,
        ...response.pages[response.pages.length - 1].data.data,
      ]);
    }
  }, [status, response?.pages]);

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

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
  if (status === 'success') {
    console.log('Object returned from useInfQuery: ', {
      response,
      error,
      fetchNextPage,
      hasNextPage,
      isFetching,
      isFetchingNextPage,
      status,
    });
  }

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
      {/* <Card> */}
      <Table
        loading={isFetching}
        columns={columns}
        // dataSource={response?.pages[0].data.data}
        dataSource={allData || []}
        rowKey={(record) => record.id}
        pagination={false}
        scroll={{ y: '400px' }}
        size="middle"
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
        onRow={(record) => {
          return {
            onClick: () => console.log(record),
          };
        }}
      />
      {/* </Card> */}
    </>
  );
}
