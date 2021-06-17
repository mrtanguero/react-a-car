import { Button, Form } from 'antd';
import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DebounceSelect from '../../components/DebounceSelect/DebounceSelect';
import authContext from '../../context/authContext';
import { getClients } from '../../services/clients';

export default function HomePage() {
  const auth = useContext(authContext);
  // const [value, setValue] = useState([]);

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <div>Dobrodošli u aplikaciju {auth?.user?.name}!</div>
      <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
        <Form.Item label="Klijent">
          <Controller
            name="client"
            control={control}
            render={({ field }) => {
              return (
                <DebounceSelect
                  // value={value}
                  {...field}
                  placeholder="Odaberite klijenta"
                  fetchOptions={getClients}
                  // onChange={(newValue) => {
                  //   setValue(newValue);
                  // }}
                  style={{
                    width: '200px',
                  }}
                />
              );
            }}
          />
          <Button htmlType="submit">Submit</Button>
        </Form.Item>
      </Form>
    </>
  );
}
