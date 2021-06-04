import React from "react";

export default function MultiStepForm({ step }) {
  return (
    <form>
      {step === 0 && "Prvi dio forme"}
      {step === 1 && "Drugi dio forme"}
      {step === 2 && "Treći dio forme"}
    </form>
  );
}
