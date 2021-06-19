import { Button, Form, Input, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';
import formDataContext from '../../../context/formDataContext';
import { getCarTypes } from '../../../services/carTypes';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';

const { TextArea } = Input;

export default function FirstStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);
  const { t } = useTranslation();

  const { data: carTypesResponse } = useQuery('getCarTypes', getCarTypes);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      plate_no: data?.plate_no,
      production_year: data?.production_year,
      car_type_id: data?.car_type_id,
      no_of_seats: data?.no_of_seats,
      price_per_day: data?.price_per_day,
      remarks: data?.remarks,
    },
  });

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  const onSubmit = (data) => {
    setValues(data);
    setStep(1);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        label={t('formLabels.plateNo')}
        help={errors['plate_no'] && errors['plate_no'].message}
        validateStatus={errors['plate_no'] && 'error'}
        hasFeedback
      >
        <Controller
          name="plate_no"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
            minLength: {
              value: 7,
              message: t('errorMessages.minCharsGeneric', { num: 7 }),
            },
          }}
          render={({ field }) => (
            <Input {...field} placeholder={t('placeholders.platesNo')} />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('formLabels.year')}
        help={errors['production_year'] && errors['production_year'].message}
        validateStatus={errors['production_year'] && 'error'}
        hasFeedback
      >
        <Controller
          name="production_year"
          control={control}
          defaultValue={data?.production_year}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
            min: {
              value: 1950,
              message: t('errorMessages.carTooOld'),
            },
            max: {
              value: new Date().getFullYear(),
              message: t('errorMessages.noFuture'),
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder={t('placeholders.productionYear')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('formLabels.carType')}
        help={errors['car_type_id'] && errors['car_type_id'].message}
        validateStatus={errors['car_type_id'] && 'error'}
        hasFeedback
      >
        <Controller
          name="car_type_id"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
          }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={t('placeholders.vehicleType')}
              options={
                carTypesResponse?.data.data.map((carType) => {
                  return { label: carType.name, value: carType.id };
                }) || []
              }
            ></Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('formLabels.seatsNo')}
        help={errors['no_of_seats'] && errors['no_of_seats'].message}
        validateStatus={errors['no_of_seats'] && 'error'}
        hasFeedback
      >
        <Controller
          name="no_of_seats"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
            min: {
              value: 1,
              message: t('errorMessages.minNoOfSeats'),
            },
            max: {
              value: 55,
              message: t('errorMessages.maxNoOfSeats'),
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder={t('placeholders.seatsNo')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('formLabels.pricePerDay')}
        help={errors['price_per_day'] && errors['price_per_day'].message}
        validateStatus={errors['price_per_day'] && 'error'}
        hasFeedback
      >
        <Controller
          name="price_per_day"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
            min: {
              value: 30,
              message: t('errorMessages.minPricePerDay', { price: 30 }),
            },
            max: {
              value: 150,
              message: t('errorMessages.maxPricePerDay', { price: 150 }),
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder={t('placeholders.pricePerDay')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label={t('formLabels.remarks')}
        help={errors['remarks'] && errors['remarks'].message}
        validateStatus={errors['remarks'] && 'error'}
        hasFeedback
      >
        <Controller
          name="remarks"
          control={control}
          rules={{
            maxLength: 255,
          }}
          render={({ field }) => (
            <TextArea
              {...field}
              rows={4}
              placeholder={t('placeholders.remarks')}
            />
          )}
        />
      </Form.Item>

      <div className="form-actions">
        <Button type="primary" htmlType="submit">
          {t('buttons.nextStep')}
        </Button>
      </div>
    </Form>
  );
}
