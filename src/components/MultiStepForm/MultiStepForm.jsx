import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Steps } from 'antd';
import FirstStep from './FirstStep/FirstStep';
import SecondStep from './SecondStep/SecondStep';
import ReviewStep from './ReviewStep/ReviewStep';
import { FormDataProvider } from '../../context/formDataContext';

const { Step } = Steps;

const steps = [
  {
    title: 'Detalji vozila',
  },
  {
    title: 'Fotografije',
  },
  {
    title: 'Pregled ',
  },
];

export default function MultiStepForm({ vehicleId, disabled, closeModal }) {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    setCurrent(0);
  }, [vehicleId]);

  return (
    <FormDataProvider vehicleId={vehicleId}>
      {!disabled ? (
        <>
          <Steps current={current} size="small">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content" style={{ paddingTop: 20 }}>
            {current === 0 && <FirstStep setStep={setCurrent} />}
            {current === 1 && <SecondStep setStep={setCurrent} />}
            {current === 2 && (
              <ReviewStep
                setStep={setCurrent}
                closeModal={closeModal}
                vehicleId={vehicleId}
              />
            )}
          </div>
        </>
      ) : (
        <ReviewStep closeModal={closeModal} disabled={disabled} />
      )}
    </FormDataProvider>
  );
}

MultiStepForm.propTypes = {
  vehicleId: PropTypes.number,
  disabled: PropTypes.bool,
  closeModal: PropTypes.func,
};
