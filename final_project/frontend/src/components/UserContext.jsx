import React, { useEffect, createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userGroups, setUserGroups] = useState([]);
  const [email, setEmail] = useState('');
  const [user_id, setUserId] = useState('');

   
   useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('https://final-project-ro9j.onrender.com/api/protected', {
          method: 'GET',
          credentials: 'include', 
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          setUserId(data.user_id);
          setEmail(data.email);
          
          
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);
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
