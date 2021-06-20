import React, { useContext, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  PageHeader,
  Spin,
  Table,
  Select,
  Typography,
  message,
} from 'antd';
import { currentTotalLength } from '../../helper/functions';
import { useInfiniteQuery, useQuery } from 'react-query';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import modalContext from '../../context/modalContext';
import { getAvailableVehicles } from '../../services/cars';
import { getCarTypes } from '../../services/carTypes';
import { useEffect } from 'react';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { useTranslation } from 'react-i18next';

export default function CreateReservationPage() {
  const [reservationDates, setReservationDates] = useState([null, null]);
  const [carType, setCarType] = useState(null);
  const [queryEnabled, setQueryEnabled] = useState(false);

  const modalCtx = useContext(modalContext);
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );

  const { data: carTypesResponse } = useQuery('getCarTypes', getCarTypes);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!(reservationDates[0] && reservationDates[1] && carType)) {
      setQueryEnabled(false);
    }
  }, [reservationDates, carType]);

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [
      'availableVehicles',
      {
        dateFrom: reservationDates[0],
        dateTo: reservationDates[1],
        carType: carType,
      },
    ],
    getAvailableVehicles,
    {
      enabled: queryEnabled,
      getNextPageParam: (lastPage) => {
        const isLastPage =
          lastPage?.data?.current_page === lastPage?.data?.last_page;
        return isLastPage ? false : lastPage?.data?.current_page + 1;
      },
      onError: (error) => {
        if (
          error.response.data.message ===
          'The end date must be a date after or equal to start date.'
        ) {
          message.error(
            'Datum završetka rezervacije ne smije biti prije datuma početka rezervacije'
          );
        }
        console.log(error.response.data.message);
      },
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleSearch = () => {
    if (reservationDates[0] && reservationDates[1] && carType) {
      setQueryEnabled(true);
    }
  };

  const handleFromDateChange = (date, dateString) => {
    setReservationDates([date.format('YYYY-MM-DD'), reservationDates[1]]);
  };

  const handleToDateChange = (date, dateString) => {
    setReservationDates([reservationDates[0], date.format('YYYY-MM-DD')]);
  };

  const handleCarTypeChange = (value) => {
    setCarType(value);
  };

  const onVehicleSelect = (record) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.createReservation', { id: record.id }),
      children: (
        <ReservationForm
          vehicleData={record}
          selectedDates={reservationDates}
          closeModal={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('pageHeaders.createReservation')}
        className="reservation-create-page-header"
        extra={
          <>
            <DatePicker
              onChange={handleFromDateChange}
              placeholder={t('placeholders.from')}
              format={i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'}
            />
            <DatePicker
              onChange={handleToDateChange}
              placeholder={t('placeholders.to')}
              format={i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'}
            />
            <Select
              placeholder={t('placeholders.vehicleType')}
              onChange={handleCarTypeChange}
              options={
                carTypesResponse?.data.data.map((carType) => {
                  return { label: carType.name, value: carType.id };
                }) || []
              }
            />
            <Button icon={<SearchOutlined />} onClick={handleSearch}>
              {t('buttons.search')}
            </Button>
          </>
        }
      />
      <Card>
        {queryEnabled ? (
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
            ]}
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
            onRow={(record, index) => {
              return {
                onClick: () => {
                  onVehicleSelect(record);
                },
                ref:
                  index === currentTotalLength(response.pages) - 3
                    ? (node) => setIntersectionObserverTarget(node)
                    : null,
              };
            }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Typography>{t('content.pickDatesAndType')}</Typography>
          </div>
        )}
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
    </>
  );
}
