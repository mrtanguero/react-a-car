import { Button, Image, message } from 'antd';
import './ReviewStep.css';
import React, { useContext } from 'react';
import formDataContext from '../../../context/formDataContext';
import { useMutation } from 'react-query';
import { createVehicle } from '../../../services/cars';

export default function ReviewStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);
  const mutation = useMutation('createVehicle', createVehicle, {
    onSuccess: () => {
      message.success('Created!');
      setValues({});
    },
    onError: (err) => console.log(err.response),
  });

  const handleSubmit = () => {
    const formData = new FormData();
    data?.photos?.fileList?.forEach((f) => {
      console.log(f);
      formData.append('photo[]', f.originFileObj, f.name);
    });
    Object.entries(data).forEach((entry) => {
      if (entry !== 'files') {
        formData.append(entry[0], entry[1]);
      }
    });
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <>
      <div className="preview-group-container">
        <Image.PreviewGroup>
          {data?.photos?.fileList?.map((photo) => {
            return (
              <Image
                key={photo.uid}
                width={150}
                height={150}
                src={URL.createObjectURL(photo.originFileObj)}
              />
            );
          })}
        </Image.PreviewGroup>
      </div>
      <div className="form-actions">
        <Button style={{ margin: '0 8px' }} onClick={() => setStep(1)}>
          Korak nazad
        </Button>
        <Button
          type="primary"
          loading={mutation.isLoading}
          onClick={handleSubmit}
        >
          Sačuvaj
        </Button>
      </div>
    </>
  );
}
