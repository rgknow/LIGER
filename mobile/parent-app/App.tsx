import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import ProposalListScreen from './src/screens/ProposalListScreen';
import ProposalDetailScreen from './src/screens/ProposalDetailScreen';
import ApprovalScreen from './src/screens/ApprovalScreen';

// Types
export type RootStackParamList = {
  Dashboard: undefined;
  ProposalList: undefined;
  ProposalDetail: { proposalId: string };
  Approval: { proposalId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator 
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: { backgroundColor: '#1976d2' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }}
        >
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ title: 'LIGER Parent Dashboard' }}
          />
          <Stack.Screen 
            name="ProposalList" 
            component={ProposalListScreen}
            options={{ title: 'Pending Proposals' }}
          />
          <Stack.Screen 
            name="ProposalDetail" 
            component={ProposalDetailScreen}
            options={{ title: 'Proposal Details' }}
          />
          <Stack.Screen 
            name="Approval" 
            component={ApprovalScreen}
            options={{ title: 'Review & Approve' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}