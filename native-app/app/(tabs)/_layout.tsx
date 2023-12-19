import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Redirect, Tabs } from 'expo-router';
import { useContext } from 'react';
import { Text, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import { AuthContext } from '../../context/AuthContext';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const { user, loadingUser } = useContext(AuthContext);

  if (!loadingUser && !user) {
    return <Redirect href='/(auth)' />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Machine State',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='list-ul' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name='two'
        options={{
          title: 'Log Part',
          tabBarIcon: ({ color }) => <TabBarIcon name='edit' color={color} />,
        }}
      />
      <Tabs.Screen
        name='logout'
        options={{
          title: 'Logout',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='sign-out' color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
