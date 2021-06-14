import { Button, Form, Input, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext, useEffect } from 'react';
import formDataContext from '../../../context/formDataContext';
import { getCarTypes } from '../../../services/carTypes';
import { useQuery } from 'react-query';

const { TextArea } = Input;

export default function FirstStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);

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
        label="Broj tablica"
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
              message: 'Broj tablica je obavezan',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Unesite registarske oznake vozila..."
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Godina proizvodnje"
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
              message: 'Godina proizvodnje je obavezno polje.',
            },
            min: {
              value: 1950,
              message: 'Vozilo mora biti novije od 1950. godine',
            },
            max: {
              value: new Date().getFullYear(),
              message: 'Godina proizvodnje ne može biti u budućnosti',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Unesite godinu proizvodnje"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Tip vozila"
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
              message: 'Obavezno je odabrati tip vozila',
            },
          }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Odaberite tip vozila"
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
        label="Broj sjedišta"
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
              message: 'Broj sjedišta je obavezan',
            },
            min: {
              value: 1,
              message: 'Vozilo ne može imati manje od jednog sjedišta',
            },
            max: {
              value: 55,
              message: 'Vozilo ne može imati više od 55 sjedišta',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Unesite broj sjedišta"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Cijena po danu"
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
              message: 'Cijena je obavezno polje',
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              placeholder="Unesite cijenu po danu"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Dodatne napomene"
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
              placeholder="Unesite godinu proizvodnje"
            />
          )}
        />
      </Form.Item>

      <div className="form-actions">
        <Button type="primary" htmlType="submit">
          Sledeći korak
        </Button>
      </div>
    </Form>
  );
}
