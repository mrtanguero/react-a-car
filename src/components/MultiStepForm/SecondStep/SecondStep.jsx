import { Button, Form, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { Controller, useForm } from 'react-hook-form';
import React, { useContext } from 'react';
import formDataContext from '../../../context/formDataContext';

const { Dragger } = Upload;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function SecondStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { photos: data.photos },
  });

  // KAKO OVOOOOO?!
  // const onChange = (info) => {
  //   console.log('First argument (info): ', info);
  //   return { file: info.file, fileList: info.fileList };
  // };

  const onSubmit = (secondStepData) => {
    if (secondStepData.photos.fileList.length === 0) {
      setError('photos', {
        type: 'required',
        message:
          'Morate odabrati makar jednu fotografiju da biste nastavili dalje',
      });
      return;
    }
    console.log('Second step data that is being added: ', secondStepData);
    setValues(secondStepData);
    setStep(2);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        help={errors['photos'] && errors['photos'].message}
        validateStatus={errors['photos'] && 'error'}
      >
        <Controller
          name="photos"
          control={control}
          rules={{
            required: {
              value: true,
              message:
                'Morate odabrati makar jednu fotografiju da biste nastavili dalje',
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Dragger
              onChange={onChange}
              multiple
              maxCount={5}
              accept="image/*"
              listType="picture"
              fileList={value?.fileList.length ? value.fileList : undefined}
              onPreview={() => {}}
              customRequest={dummyRequest}
              children={
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Kliknite ili prevucite fotografije u ovo polje
                  </p>
                  <p className="ant-upload-hint">
                    Podržano je aploadovanje jedne ili više fotografija
                    istovremeno.
                  </p>
                </>
              }
            />
          )}
        />
      </Form.Item>

      <div className="form-actions">
        <Button style={{ margin: '0 8px' }} onClick={() => setStep(0)}>
          Korak nazad
        </Button>
        <Button type="primary" htmlType="submit">
          Sledeći korak
        </Button>
      </div>
    </Form>
  );
}
