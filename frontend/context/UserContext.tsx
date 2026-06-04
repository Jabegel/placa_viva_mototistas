import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  phone: string;
  plate: string;
  favoriteStation: string;
};

export type VehicleKind = 'car' | 'suv' | 'truck' | 'motorcycle' | 'van';

export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  fuelType: string;
  fuelColor: string;
  hasAlert?: boolean;
  kind: VehicleKind;
  photo?: string;
  iconName?: string;   // Ionicons name escolhido pelo usuário
  iconColor?: string;  // cor do ícone
  emoji?: string;      // fallback legado
};

type UserContextType = {
  user: User;
  setUser: (u: Partial<User>) => void;
  vehicles: Vehicle[];
  updateVehicle: (id: string, patch: Partial<Vehicle>) => void;
  setVehicles: (v: Vehicle[]) => void;
};

const DEFAULT_USER: User = {
  name: '',
  phone: '',
  plate: '',
  favoriteStation: '',
};

const DEFAULT_VEHICLES: Vehicle[] = [
  { id: 'v1', plate: 'ABC-1D23', model: '',             fuelType: 'Não definido',       fuelColor: '#aab0bc', hasAlert: true,  kind: 'car' },
  { id: 'v2', plate: 'ABC-1D23', model: 'Nivus',        fuelType: 'Gasolina Aditivada', fuelColor: '#c8a832', hasAlert: false, kind: 'car' },
  { id: 'v3', plate: 'CBA-3021', model: 'Jeep Compass', fuelType: 'Etanol Comum',       fuelColor: '#4a7c3f', hasAlert: true,  kind: 'suv' },
];

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  setUser: () => {},
  vehicles: DEFAULT_VEHICLES,
  updateVehicle: () => {},
  setVehicles: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(DEFAULT_USER);
  const [vehicles, setVehiclesState] = useState<Vehicle[]>(DEFAULT_VEHICLES);

  const setUser = (u: Partial<User>) =>
    setUserState(prev => ({ ...prev, ...u }));

  const updateVehicle = (id: string, patch: Partial<Vehicle>) =>
    setVehiclesState(prev =>
      prev.map(v => v.id === id ? { ...v, ...patch } : v)
    );

  const setVehicles = (v: Vehicle[]) => setVehiclesState(v);

  return (
    <UserContext.Provider value={{ user, setUser, vehicles, updateVehicle, setVehicles }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
