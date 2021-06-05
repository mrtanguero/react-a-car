import React, { useState } from "react";

const authContext = React.createContext({
  user: {},
  jwToken: "",
  setUser: (user) => {},
  setJwToken: (jwToken) => {},
});

export const AuthProvider = (props) => {
  const [user, setUser] = useState({});
  const [jwToken, setJwToken] = useState("");

  // TODO: Kad bude API ovo pogledaj malo!
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     setUser(JSON.parse(localStorage.getItem("user")));
  //     setJwToken(JSON.parse(localStorage.getItem("jwToken")));
  //   }
  // }, []);

  return (
    <authContext.Provider value={{ user, jwToken, setUser, setJwToken }}>
      {props.children}
    </authContext.Provider>
  );
};

export default authContext;
