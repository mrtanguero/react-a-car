import { Button, Card, Form, Input, message, PageHeader } from 'antd';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router';
import { useMutation } from 'react-query';
import authContext from '../../context/authContext';
import { login } from '../../services/account';

export default function LoginForm() {
  const auth = useContext(authContext);
  const history = useHistory();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const mutation = useMutation((data) => login(data), {
    onSuccess: (response) => {
      localStorage.setItem('jwt', response.data.access_token);
      auth.setJwt(response.data.access_token);
      history.replace('/');
    },
    onError: (error) => {
      if (error.response.data.error === 'Unauthorized') {
        message.error('Jeste li sigurni da su vam to email i password?');
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {auth.jwt ? (
        <Redirect to="/" />
      ) : (
        <>
          <PageHeader title="Login" />
          <Card>
            <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
              <Form.Item
                label="Email"
                help={errors.email && errors.email.message}
                validateStatus={errors.email && 'error'}
                hasFeedback
              >
                <Input
                  placeholder="Unesite svoju email adresu..."
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Obavezno polje!',
                    },
                  })}
                />
              </Form.Item>
              <Form.Item
                label="Lozinka"
                help={errors.password && errors.password.message}
                validateStatus={errors.password && 'error'}
                hasFeedback
              >
                <Input
                  type="password"
                  placeholder="Unesite svoju lozinku..."
                  {...register('password', {
                    required: {
                      value: true,
                      message: 'Obavezno polje!',
                    },
                  })}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Uloguj se
              </Button>
            </Form>
          </Card>
        </>
      )}
    </>
  );
}
