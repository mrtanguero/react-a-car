import React from "react";
import "./MultiStepForm.css";
import { Button, Input, message } from "antd";

export default function MultiStepForm({ step, setStep, steps }) {
  const next = () => {
    setStep(step + 1);
  };

  const prev = () => {
    setStep(step - 1);
  };

  return (
    <>
      <form
        className="form-new-car"
        style={{ paddingTop: 20, paddingBottom: 20 }}
      >
        {step === 0 && <Input aria-label="plates" />}
        {step === 1 && "Drugi dio forme"}
        {step === 2 && "Treći dio forme"}
      </form>
      <div className="form-actions">
        {step > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Vrati se
          </Button>
        )}
        {step < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Sledeći korak
          </Button>
        )}
        {step === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Sačuvaj
          </Button>
        )}
      </div>
    </>
  );
}
