import React from "react";

import { Steps, Button, message } from "antd";
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

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div className="steps-content">{<MultiStepForm step={current} />}</div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Sledeći korak
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Sačuvaj
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Vrati se
          </Button>
        )}
      </div>
    </>
  );
}
