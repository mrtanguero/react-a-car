import { Button, Image, message } from 'antd';
import './ReviewStep.css';
import React, { useContext } from 'react';
import formDataContext from '../../../context/formDataContext';

export default function ReviewStep({ setStep }) {
  const { data } = useContext(formDataContext);

  const handleSubmit = () => {
    console.log('Data submitted: ', data);
    message.success('Submitted!');
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
        <Button type="primary" onClick={handleSubmit}>
          Sačuvaj
        </Button>
      </div>
    </>
  );
}
