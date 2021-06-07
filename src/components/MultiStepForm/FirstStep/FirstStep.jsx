import { Button, Form, Input } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext } from 'react';
import formDataContext from '../../../context/formDataContext';

export default function FirstStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
  });

  // Trebaće možda za async
  // useEffect(() => {
  //   reset(data);
  // }, [data, reset]);

  const onSubmit = (data) => {
    setValues(data);
    setStep(1);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        label="Broj tablica"
        help={errors['platesNumber'] && errors['platesNumber'].message}
        validateStatus={errors['platesNumber'] && 'error'}
        hasFeedback
      >
        <Controller
          name="platesNumber"
          control={control}
          defaultValue={data?.platesNumber}
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
        help={errors['productionYear'] && errors['productionYear'].message}
        validateStatus={errors['productionYear'] && 'error'}
        hasFeedback
      >
        <Controller
          name="productionYear"
          control={control}
          defaultValue={data?.productionYear}
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
      <div className="form-actions">
        <Button type="primary" htmlType="submit">
          Sledeći korak
        </Button>
      </div>
    </Form>
  );
}
