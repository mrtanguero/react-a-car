import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  PageHeader,
  Space,
  Grid,
  Descriptions,
  Spin,
  Table,
  Modal,
  message,
} from 'antd';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  deleteReservation,
  getReservations,
} from '../../services/reservations';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { useHistory } from 'react-router-dom';
import authContext from '../../context/authContext';
import moment from 'moment';

const { confirm } = Modal;
const { useBreakpoint } = Grid;

export default function ReservationsPage() {
  const modalCtx = useContext(modalContext);
  const history = useHistory();
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const auth = useContext(authContext);
  const { t, i18n } = useTranslation();
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
      message.success(t('successMessages.deleted'));
    },
    onError: () => {
      message.error(error.response.data.message);
    },
  });

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('reservations', getReservations, {
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.data.current_page === lastPage.data.last_page;
      return isLastPage ? false : lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (
        error.response.data.message ===
          'Attempt to read property "role_id" on null' ||
        error.response.data.message === 'Unauthenticated.'
      ) {
        localStorage.clear();
        auth.setJwt('');
        auth.setUser(null);
        history.replace('/login');
      }
    },
  });

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleNewReservationClick = () => {
    history.push('/reservations/create');
  };

  const handleShowReservation = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.showReservation', { reservationId: id }),
      children: (
        <ReservationForm
          reservationId={id}
          closeModal={handleCancelModal}
          disabled={true}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleEditReservationClick = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.editReservation', { reservationId: id }),
      children: (
        <ReservationForm reservationId={id} closeModal={handleCancelModal} />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  if (error) console.log(error.response);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.reservations')}
        extra={
          <Button onClick={handleNewReservationClick}>
            <CalendarOutlined />
            {t('buttons.newReservation')}
          </Button>
        }
      />
      {!screens.xs ? (
        <Card>
          <Table
            loading={!response?.pages.length && isFetching}
            columns={[
              {
                title: t('tableHeaders.client'),
                dataIndex: ['client', 'name'],
                key: 'name',
                width: 180,
              },
              {
                title: t('tableHeaders.vehicle'),
                dataIndex: ['vehicle', 'plate_no'],
                key: 'country',
                width: 120,
              },
              {
                title: t('tableHeaders.from'),
                dataIndex: 'from_date',
                key: 'document-id',
                width: 100,
                render: (_, record) => {
                  return moment(record.from_date).format(
                    i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                  );
                },
              },
              {
                title: t('tableHeaders.to'),
                dataIndex: 'to_date',
                key: 'email',
                width: 100,
                render: (_, record) => {
                  return moment(record.to_date).format(
                    i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                  );
                },
              },
              {
                title: t('tableHeaders.rentLocation'),
                dataIndex: ['rent_location', 'name'],
                key: 'phone',
                width: 150,
              },
              {
                title: t('tableHeaders.returnLocation'),
                dataIndex: ['return_location', 'name'],
                key: 'phone',
                width: 150,
              },
              {
                title: t('tableHeaders.totalPrice'),
                dataIndex: ['total_price'],
                key: 'price',
                width: 120,
                render: (_, record) => `${record.total_price}???`,
              },
              {
                title: t('tableHeaders.actions'),
                key: 'action',
                align: 'center',
                width: 100,
                fixed: 'right',
                render: (text, record) => (
                  <Space size="small">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditReservationClick(record.id);
                      }}
                      icon={<EditOutlined />}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm({
                          title: t('modals.confirmReservationDelete'),
                          icon: <ExclamationCircleOutlined />,
                          content: t('modals.actionPermanent'),
                          okType: 'danger',
                          onOk() {
                            return mutation.mutateAsync(record.id);
                          },
                          onCancel() {},
                        });
                      }}
                      icon={<DeleteOutlined />}
                      danger
                    />
                  </Space>
                ),
              },
            ]}
            dataSource={
              [].concat.apply(
                [],
                response?.pages.map((page) => page.data.data)
              ) || []
            }
            rowKey={(record) => record.id}
            pagination={false}
            scroll={{ x: '100%', y: '60vh' }}
            size="small"
            onRow={(record, index) => {
              return {
                onClick: () => {
                  handleShowReservation(record.id);
                },
                ref:
                  index === currentTotalLength(response.pages) - 3
                    ? (node) => setIntersectionObserverTarget(node)
                    : null,
              };
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              textAlign: 'center',
            }}
          >
            {isFetchingNextPage && <Spin size="small" />}
          </div>
        </Card>
      ) : (
        <Table
          loading={!response?.pages.length && isFetching}
          dataSource={
            [].concat.apply(
              [],
              response?.pages.map((page) => page.data.data)
            ) || []
          }
          showHeader={false}
          rowKey={(record) => record.id}
          pagination={false}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: () => {
                handleShowReservation(record.id);
              },
              ref:
                index === currentTotalLength(response.pages) - 3
                  ? (node) => setIntersectionObserverTarget(node)
                  : null,
            };
          }}
          columns={[
            {
              title: t('tableHeaders.client'),
              dataIndex: 'client',
              key: 'client',
              width: '100%',
              render: (_, record) => {
                return (
                  <>
                    <Descriptions
                      className="small-screen-table-descriptions"
                      bordered
                      size="small"
                      column={1}
                      labelStyle={{ width: '50%', textAlign: 'right' }}
                      contentStyle={{ color: 'grey' }}
                    >
                      <Descriptions.Item label={t('formLabels.client')}>
                        {record.client.name}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.vehicle')}>
                        {record.vehicle.plate_no}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('tableHeaders.from')}>
                        {moment(record.from_date).format(
                          i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.to')}>
                        {moment(record.to_date).format(
                          i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('tableHeaders.rentLocation')}>
                        {record.rent_location.name}
                      </Descriptions.Item>
                      <Descriptions.Item
                        label={t('tableHeaders.returnLocation')}
                      >
                        {record.return_location.name}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.totalPrice')}>
                        {record.total_price}???
                      </Descriptions.Item>
                    </Descriptions>
                    <Space size="small" className="small-screen-table-buttons">
                      <Button
                        className="small-screen-table-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditReservationClick(record.id);
                        }}
                        icon={<EditOutlined />}
                      >
                        Edit
                      </Button>
                      <Button
                        className="small-screen-table-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirm({
                            title: t('modals.confirmReservationDelete'),
                            icon: <ExclamationCircleOutlined />,
                            content: t('modals.actionPermanent'),
                            okType: 'danger',
                            onOk() {
                              return mutation.mutateAsync(record.id);
                            },
                            onCancel() {},
                          });
                        }}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Button>
                    </Space>
                  </>
                );
              },
            },
          ]}
        />
      )}
    </>
  );
}
