import { Button, Card, Form, Input, message, Typography } from 'antd';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router';
import { useMutation } from 'react-query';
import authContext from '../../context/authContext';
import { login } from '../../services/account';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
        message.error('Pogrešni kredencijali.');
      } else {
        message.error(error.response.data.error);
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
        <div
          className="login-container"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: '400px' }}>
            <Typography.Title
              level={3}
              style={{ textAlign: 'center', marginBottom: 24 }}
            >
              Ulogujte se
            </Typography.Title>
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
                      pattern: {
                        value: emailRegEx,
                        message: 'Morate unijeti validnu email adresu',
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
                      minLength: {
                        value: 4,
                        message: 'Minimalna dužina passworda je 4 karaktera',
                      },
                      maxLength: {
                        value: 12,
                        message: 'Maksimalna dužina passworda je 12 karaktera',
                      },
                      pattern: {
                        value: /^[A-Za-z0-9!#%&]+$/i,
                        message:
                          'Samo mala i velika slova i karakteri !, #, % i &',
                      },
                    })}
                  />
                </Form.Item>
                <div className="form-actions">
                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    htmlType="submit"
                    block
                  >
                    Uloguj se
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
