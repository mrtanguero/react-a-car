import { Select, Form, Spin, Button, DatePicker, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { currentTotalLength } from '../../helper/functions';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { getClients } from '../../services/clients';
import moment from 'moment';
import { createReservation, getLocations } from '../../services/reservations';

const { Option } = Select;

export default function CreateReservationForm({
  vehicleData,
  selectedDates,
  closeModal,
}) {
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const [queryIsEnabled, setQueryIsEnabled] = useState(false);
  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      from_date: moment(selectedDates[0]),
      to_date: moment(selectedDates[1]),
      vehicle_id: vehicleData.id,
    },
  });

  const { data: locationsResponse } = useQuery('locations', getLocations);
  const queryClient = useQueryClient();

  const mutation = useMutation('createReservation', createReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
      closeModal();
      reset();
      message.success('Sačuvano!');
    },
    onError: (error) => {
      console.log(error.response.data.message);
    },
  });

  const renderOptions = (data) => {
    return [].concat
      .apply(
        [],
        data?.pages.map((page) => page.data.data)
      )
      .map((client, ind) => {
        return (
          <Option
            ref={
              ind === currentTotalLength(response.pages) - 3
                ? (node) => setIntersectionObserverTarget(node)
                : null
            }
            key={client.id}
            value={client.id}
            label={client.name}
          >
            {client.name}
          </Option>
        );
      });
  };

  const {
    data: response,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ['clients', { searchTerm: clientSearchTerm }],
    getClients,
    {
      getNextPageParam: (lastPage) => {
        const isLastPage =
          lastPage.data.current_page === lastPage.data.last_page;
        return isLastPage ? false : lastPage.data.current_page + 1;
      },
      enabled: queryIsEnabled,
      refetchOnWindowFocus: false,
      onError: (error) => console.log(error.response),
    }
  );

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const onSearch = (data) => {
    setClientSearchTerm(data);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => setQueryIsEnabled(true));
    return () => {
      clearTimeout(timeOut);
    };
  }, [clientSearchTerm]);

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      from_date: data.from_date.format('YYYY-MM-DD'),
      to_date: data.to_date.format('YYYY-MM-DD'),
    });
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        label="Klijent"
        help={errors['client_id'] && errors['client_id'].message}
        validateStatus={errors['client_id'] && 'error'}
        hasFeedback
      >
        <Controller
          name="client_id"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Klijent je obavezan za rezervaciju',
            },
          }}
          render={({ field }) => (
            <Select
              {...field}
              showSearch={true}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onSearch={onSearch}
              notFoundContent={
                isFetching || isFetchingNextPage ? <Spin size="small" /> : null
              }
              placeholder="Odaberite klijenta"
            >
              {renderOptions(response)}
            </Select>
          )}
        />
      </Form.Item>
      <div style={{ display: 'flex', gap: 24 }}>
        <Form.Item
          style={{ flex: 1, width: '100%' }}
          label="Od"
          help={errors['from_date'] && errors['from_date'].message}
          validateStatus={errors['from_date'] && 'error'}
          hasFeedback
        >
          <Controller
            name="from_date"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Obavezno polje.',
              },
            }}
            render={({ field }) => (
              <DatePicker
                style={{ width: '100%' }}
                {...field}
                placeholder="Datum od"
              />
            )}
          />
        </Form.Item>
        <Form.Item
          style={{ flex: 1 }}
          label="Do"
          help={errors['to_date'] && errors['to_date'].message}
          validateStatus={errors['to_date'] && 'error'}
          hasFeedback
        >
          <Controller
            name="to_date"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Obavezno polje.',
              },
            }}
            render={({ field }) => (
              <DatePicker
                style={{ width: '100%' }}
                {...field}
                placeholder="Datum do"
              />
            )}
          />
        </Form.Item>
      </div>
      <Form.Item
        label="Lokacija preuzimanja"
        help={errors['rent_location_id'] && errors['rent_location_id'].message}
        validateStatus={errors['rent_location_id'] && 'error'}
        hasFeedback
      >
        <Controller
          name="rent_location_id"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Obavezno polje',
            },
          }}
          render={({ field }) => (
            <Select
              {...field}
              showSearch={true}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Odaberite klijenta"
              options={
                locationsResponse?.data.map((carType) => {
                  return { label: carType.name, value: carType.id };
                }) || []
              }
            />
          )}
        />
      </Form.Item>
      <Form.Item
        label="Lokacija vraćanja"
        help={
          errors['return_location_id'] && errors['return_location_id'].message
        }
        validateStatus={errors['return_location_id'] && 'error'}
        hasFeedback
      >
        <Controller
          name="return_location_id"
          control={control}
          rules={{
            required: {
              value: true,
              message: 'Klijent je obavezan za rezervaciju',
            },
          }}
          render={({ field }) => (
            <Select
              {...field}
              showSearch={true}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Odaberite klijenta"
              options={
                locationsResponse?.data.map((carType) => {
                  return { label: carType.name, value: carType.id };
                }) || []
              }
            />
          )}
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Sačuvaj
      </Button>
    </Form>
  );
}
