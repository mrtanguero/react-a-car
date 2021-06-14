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
} from 'antd';
import { currentTotalLength } from '../../helper/functions';
import { useInfiniteQuery, useQuery } from 'react-query';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import modalContext from '../../context/modalContext';
import CreateReservationForm from '../../components/CreateReservationForm/CreateReservationForm';
import { getAvailableVehicles } from '../../services/cars';
import { getCarTypes } from '../../services/carTypes';
import { useEffect } from 'react';

const { RangePicker } = DatePicker;

export default function CreateReservationPage() {
  const [reservationDates, setReservationDates] = useState([null, null]);
  const [carType, setCarType] = useState(null);
  const [queryEnabled, setQueryEnabled] = useState(false);

  const modalCtx = useContext(modalContext);
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );

  const { data: carTypesResponse } = useQuery('getCarTypes', getCarTypes);
  // const { t } = useTranslation();
  // const queryClient = useQueryClient();

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
      onSuccess: (data) => console.log(data),
      onError: (error) => console.log(error.response.data.message),
      refetchOnWindowFocus: false,
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

  const handleDatesChange = (date, dateString) => {
    console.log('Dates: ', date, dateString);
    setReservationDates([dateString[0], dateString[1]]);
  };

  const handleCarTypeChange = (value) => {
    console.log(value);
    setCarType(value);
  };

  const onVehicleSelect = (record) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Forma za kreiranje rezervacije za vozilo ${record.id}`,
      children: (
        <CreateReservationForm
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
        title="Napravi novu rezervaciju"
        extra={
          <>
            <RangePicker onChange={handleDatesChange} />
            <Select
              placeholder="Odaberite tip vozila"
              onChange={handleCarTypeChange}
              options={
                carTypesResponse?.data.data.map((carType) => {
                  return { label: carType.name, value: carType.id };
                }) || []
              }
            />
            <Button icon={<SearchOutlined />} onClick={handleSearch}>
              Pretraži
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
                title: 'Licence plate',
                dataIndex: 'plate_no',
                key: 'plates',
                width: 105,
              },
              {
                title: 'Year',
                dataIndex: 'production_year',
                key: 'year',
                width: 80,
              },
              {
                title: 'Seats',
                dataIndex: 'no_of_seats',
                key: 'seats',
                width: 80,
              },
              {
                title: 'Price per day',
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
          'The results will go here'
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
