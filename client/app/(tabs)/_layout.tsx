
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Tablayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size ,focused}) => (
            <MaterialCommunityIcons
              name="home-lightbulb"
              size={size}
              color={"green"}
                style={{ opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
        <Tabs.Screen 
        name="Blog"
        options={{
          headerShown: false,
            tabBarLabel: 'Blog',
            tabBarIcon: ({ color, size ,focused}) => (
            <MaterialCommunityIcons
                name="notebook-outline"
                size={size}
                color={"green"}
                style={{ opacity: focused ? 1 : 0.5 }}
            />
            ),
        }}
        />
        <Tabs.Screen
        name="Profile"
        options={{
          headerShown: false,
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size ,focused}) => (
            <MaterialCommunityIcons
                name="account-circle-outline"
                size={size}
                color={"green"}
                style={{ opacity: focused ? 1 : 0.5 }}
            />
            ),
        }}
        />
    </Tabs>
  );
}
