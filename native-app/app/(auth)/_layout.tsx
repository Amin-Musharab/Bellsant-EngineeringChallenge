import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';

import { AuthContext, AuthProvider } from '../../context/AuthContext';

export default function AuthLayout() {
  const { user, loadingUser } = useContext(AuthContext);

  if (!loadingUser && user) {
    return <Redirect href='/(tabs)' />;
  }

  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
    </Stack>
  );
}
