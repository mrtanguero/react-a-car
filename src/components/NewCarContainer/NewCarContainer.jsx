import React from 'react';
import { FormDataProvider } from '../../context/formDataContext';

import MultiStepForm from '../MultiStepForm/MultiStepForm';

export default function NewCarContainer() {
  return (
    <>
      <FormDataProvider>
        <MultiStepForm />
      </FormDataProvider>
    </>
  );
}
