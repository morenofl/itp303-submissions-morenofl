import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroups, setUserGroups] = useState([]); // ← Track groups the user joined

  
 

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      userGroups,
      setUserGroups,
    }}>
      {children}
    </UserContext.Provider>
  );
}
