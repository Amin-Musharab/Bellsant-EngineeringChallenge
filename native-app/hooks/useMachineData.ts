import { useState, useEffect, useCallback } from 'react';

import * as userApi from '../api/user';

export const useMachineData = () => {
  const [machineData, setMachineData] = useState(undefined);

  useEffect(() => {
    // Load machine data from backend api when the hook initializes
    loadMachineData();
  }, []);

  const loadMachineData = useCallback(async () => {
    try {
      const {
        user: { machineData },
      } = await userApi.me();
      setMachineData(machineData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const resetMachineData = useCallback(async () => {
    try {
      await userApi.removeMachineData();
      setMachineData(undefined);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateMachineData = useCallback(async (newMachineData) => {
    try {
      await userApi.persistMachineData(newMachineData);
      setMachineData(newMachineData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const setScores = useCallback(
    async (newScores) => {
      try {
        if (!machineData) {
          return;
        }

        const newMachineData = JSON.parse(JSON.stringify(machineData)); // Deep copy machine parts
        newMachineData.scores = newScores;

        await userApi.persistMachineData(newMachineData);
        setMachineData(newMachineData);
      } catch (error) {
        console.error(error);
      }
    },
    [machineData]
  );

  return {
    machineData,
    updateMachineData,
    resetMachineData,
    loadMachineData,
    setScores,
  };
};
