import React from 'react';
import { StyleSheet } from 'react-native';

import { Text } from './Themed';
import { machineNames } from '../data/types';

export const MachineScore = ({
  machineName,
  score,
}: {
  machineName: string;
  score: string;
}) => {
  return (
    <>
      {score && (
        <>
          <Text
            style={styles.text}
          >{`${machineNames[machineName]}: ${score}`}</Text>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  text: {},
});
