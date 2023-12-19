import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';

import { AuthContext } from '../../context/AuthContext';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const { login, loadingUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(username, password);
      setError('');
      router.push('/(tabs)/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loadingUser ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder='Username'
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button title='Login' onPress={handleLogin} />
          <Link href='/signup'>Signup</Link>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
});

export default LoginScreen;
