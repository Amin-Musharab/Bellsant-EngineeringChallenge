import React, { createContext } from 'react';

import { useMachineData } from '../hooks/useMachineData';

export const MachineDataContext = createContext<
  ReturnType<typeof useMachineData>
>({
  loadMachineData: Promise.reject,
  setScores: Promise.reject,
  resetMachineData: Promise.reject,
  updateMachineData: Promise.reject,
  machineData: null,
});

export const MachineDataProvider = ({ children }) => {
  const value = useMachineData();

  return (
    <MachineDataContext.Provider value={value}>
      {children}
    </MachineDataContext.Provider>
  );
};
