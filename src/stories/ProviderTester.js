import React, { useContext } from "react";
import "antd/dist/antd.css";

import authContext from "../context/authContext.jsx";
import { Button } from "antd";

export default function ProviderTester() {
  const auth = useContext(authContext);

  return (
    <div>
      <p>{auth.user?.name}</p>
      <p>{auth.user?.mail}</p>
      <Button onClick={() => auth.setUser({ ...auth.user, name: "Darko" })}>
        Promijeni usera
      </Button>
    </div>
  );
}
