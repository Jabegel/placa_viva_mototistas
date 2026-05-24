import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  phone: string;
  plate: string;
  favoriteStation: string;
};

type UserContextType = {
  user: User;
  setUser: (u: Partial<User>) => void;
};

const DEFAULT_USER: User = {
  name: '',
  phone: '',
  plate: '',
  favoriteStation: '',
};

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  setUser: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(DEFAULT_USER);
  const setUser = (u: Partial<User>) =>
    setUserState(prev => ({ ...prev, ...u }));
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
