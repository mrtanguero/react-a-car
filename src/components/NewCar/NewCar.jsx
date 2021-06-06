import React from "react";

import { Steps } from "antd";
import MultiStepForm from "../MultiStepForm/MultiStepForm";

const { Step } = Steps;

const steps = [
  {
    title: "Detalji vozila",
  },
  {
    title: "Fotografije",
  },
  {
    title: "Pregled ",
  },
];

export default function NewCarForm() {
  const [current, setCurrent] = React.useState(0);

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">
        {<MultiStepForm step={current} setStep={setCurrent} steps={steps} />}
      </div>
    </>
  );
}
