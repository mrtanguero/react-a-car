import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  PageHeader,
  Space,
  Spin,
  Grid,
  Table,
  Modal,
  message,
  Input,
  Descriptions,
} from 'antd';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { deleteVehicle, getVehicles } from '../../services/cars';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import MultiStepForm from '../../components/MultiStepForm/MultiStepForm';

const { confirm } = Modal;
const { Search } = Input;
const { useBreakpoint } = Grid;

export default function CarsPage() {
  const modalCtx = useContext(modalContext);
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteVehicle(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      message.success(t('successMessages.deleted'));
    },
    onError: (error) => {
      if (
        error.response.data.message ===
        "Can't delete vehicle witch has reservation attached to it!"
      ) {
        message.error(t('errorMessages.vehicleHasReservations'));
      } else {
        message.error(error.response.data.message);
      }
    },
  });

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['vehicles', { searchTerm }], getVehicles, {
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.data.current_page === lastPage.data.last_page;
      return isLastPage ? false : lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
  });

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleNewVehicleClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newCar'),
      children: <MultiStepForm closeModal={handleCancelModal} />,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleShowVehicle = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.showVehicle', { id }),
      children: (
        <MultiStepForm
          vehicleId={id}
          disabled={true}
          closeModal={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleEditVehicleClick = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.editVehicle', { id }),
      children: (
        <MultiStepForm
          vehicleId={id}
          disabled={false}
          closeModal={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const onSearch = (data) => {
    setSearchTerm(data);
  };

  if (error) console.log(error.response);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.vehicles')}
        extra={
          <>
            <Search
              placeholder={t('placeholders.search')}
              onSearch={onSearch}
              loading={isFetching}
            />
            <Button onClick={handleNewVehicleClick}>
              <CarOutlined />
              {t('buttons.newCar')}
            </Button>
          </>
        }
      />
      {!screens.xs ? (
        <Card>
          <Table
            loading={!response?.pages.length && isFetching}
            columns={[
              {
                title: t('tableHeaders.plateNo'),
                dataIndex: 'plate_no',
                key: 'plates',
                width: 105,
              },
              {
                title: t('tableHeaders.year'),
                dataIndex: 'production_year',
                key: 'year',
                width: 80,
              },
              {
                title: t('tableHeaders.carType'),
                dataIndex: ['car_type', 'name'],
                key: 'type',
                width: 120,
              },
              {
                title: t('tableHeaders.seatsNum'),
                dataIndex: 'no_of_seats',
                key: 'seats',
                width: 80,
              },
              {
                title: t('tableHeaders.pricePerDay'),
                dataIndex: 'price_per_day',
                key: 'price',
                width: 120,
              },
              {
                title: t('tableHeaders.remarks'),
                dataIndex: 'remarks',
                key: 'remarks',
                width: 200,
                ellipsis: true,
                render: (_, record) => {
                  if (record.remarks) {
                    return record.remarks;
                  }
                  return '-';
                },
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
                        handleEditVehicleClick(record.id);
                      }}
                      icon={<EditOutlined />}
                    />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm({
                          title: t('modals.confirmVehicleDelete'),
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
                  handleShowVehicle(record.id);
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
                handleShowVehicle(record.id);
              },
              ref:
                index === currentTotalLength(response.pages) - 3
                  ? (node) => setIntersectionObserverTarget(node)
                  : null,
            };
          }}
          columns={[
            {
              title: t('tableHeaders.plateNo'),
              dataIndex: 'plate_no',
              key: 'plate',
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
                      <Descriptions.Item label={t('formLabels.plateNo')}>
                        {record.plate_no}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.year')}>
                        {record.production_year}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.carType')}>
                        {record.car_type.name}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.seatsNo')}>
                        {record.no_of_seats}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('formLabels.pricePerDay')}>
                        {record.price_per_day}???
                      </Descriptions.Item>
                    </Descriptions>
                    <Space size="small" className="small-screen-table-buttons">
                      <Button
                        className="small-screen-table-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditVehicleClick(record.id);
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
                            title: t('modals.confirmVehicleDelete'),
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
