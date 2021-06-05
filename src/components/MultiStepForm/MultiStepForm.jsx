import React from "react";
import { Input } from "antd";

export default function MultiStepForm({ step }) {
  return (
    <form style={{ paddingTop: 20, paddingBottom: 20 }}>
      {step === 0 && <Input aria-label="plates" />}
      {step === 1 && "Drugi dio forme"}
      {step === 2 && "Treći dio forme"}
    </form>
  );
}
