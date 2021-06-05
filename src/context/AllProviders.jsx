import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./authContext";
import { ModalPropsProvider } from "./modalContext";

export default function AllProviders(props) {
  return (
    <AuthProvider>
      <ModalPropsProvider>
        <BrowserRouter>{props.children}</BrowserRouter>
      </ModalPropsProvider>
    </AuthProvider>
  );
}
