import React, { createContext } from 'react';

export const UserContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = React.useState({});

  return <UserContext.Provider value={{ user, setUser }}>{props.children}</UserContext.Provider>;
}

export default UserContextProvider;
