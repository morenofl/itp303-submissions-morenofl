import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [email, setEmail] = useState('');
  const [user_id, setUserId] = useState('');

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      setIsLoggedIn,
      userGroups,
      setUserGroups,
      email,
      setEmail,
      user_id,
      setUserId,
    }}>
      {children}
    </UserContext.Provider>
  );
}
