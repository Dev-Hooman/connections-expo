import  React, {createContext, useState, useEffect, useContext} from 'react'

const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  
return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};


export const useAuthProvider = () => useContext(AuthenticatedUserContext);
