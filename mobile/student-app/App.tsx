import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import CreateProposalScreen from './src/screens/CreateProposalScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import GiftScreen from './src/screens/GiftScreen';

export type RootTabParamList = {
  Dashboard: undefined;
  CreateProposal: undefined;
  Portfolio: undefined;
  Gifts: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap;

              if (route.name === 'Dashboard') {
                iconName = 'dashboard';
              } else if (route.name === 'CreateProposal') {
                iconName = 'add-circle';
              } else if (route.name === 'Portfolio') {
                iconName = 'pie-chart';
              } else if (route.name === 'Gifts') {
                iconName = 'card-giftcard';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              } else {
                iconName = 'help';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1976d2',
            tabBarInactiveTintColor: 'gray',
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff'
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'My LIGER' }} />
          <Tab.Screen name="CreateProposal" component={CreateProposalScreen} options={{ title: 'New Proposal' }} />
          <Tab.Screen name="Portfolio" component={PortfolioScreen} options={{ title: 'Portfolio' }} />
          <Tab.Screen name="Gifts" component={GiftScreen} options={{ title: 'Gifts' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}