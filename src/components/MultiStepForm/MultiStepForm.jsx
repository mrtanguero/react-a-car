import React from 'react';
import './MultiStepForm.css';
import { Steps } from 'antd';
import FirstStep from './FirstStep/FirstStep';
import SecondStep from './SecondStep/SecondStep';
import ReviewStep from './ReviewStep/ReviewStep';

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

export default function MultiStepForm() {
  const [current, setCurrent] = React.useState(0);

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content" style={{ paddingTop: 20 }}>
        {current === 0 && <FirstStep setStep={setCurrent} />}
        {current === 1 && <SecondStep setStep={setCurrent} />}
        {current === 2 && <ReviewStep setStep={setCurrent} />}
      </div>
    </>
  );
}
