import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

import ScannerScreen from '../screens/scan/ScannerScreen';
import ScanResultScreen from '../screens/scan/ScanResultScreen';
import FoodSearchScreen from '../screens/scan/FoodSearchScreen';
import ChatScreen from '../screens/chat/ChatScreen';

import MealLogScreen from '../screens/home/MealLogScreen';
import RecommendationsScreen from '../screens/home/RecommendationsScreen';
import BudgetMealScreen from '../screens/home/BudgetMealScreen';
import WhatCanICookScreen from '../screens/home/WhatCanICookScreen';
import WeeklyReportScreen from '../screens/home/WeeklyReportScreen';
import MoodEnergyScreen from '../screens/home/MoodEnergyScreen';
import RamadanModeScreen from '../screens/home/RamadanModeScreen';

import HealthProfileEditScreen from '../screens/profile/HealthProfileEditScreen';
import FamilyMembersScreen from '../screens/profile/FamilyMembersScreen';
import ChildProfileScreen from '../screens/profile/ChildProfileScreen';
import DiabetesModeScreen from '../screens/profile/DiabetesModeScreen';
import PregnancyModeScreen from '../screens/profile/PregnancyModeScreen';
import ShasthoShebikaPortalScreen from '../screens/profile/ShasthoShebikaPortalScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import ConsentScreen from '../screens/profile/ConsentScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* Scan flow */}
        <Stack.Screen name="Scan" component={ScannerScreen} />
        <Stack.Screen name="ScanResult" component={ScanResultScreen} />
        <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />

        {/* Home flow */}
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="MealLog" component={MealLogScreen} />
        <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
        <Stack.Screen name="BudgetMeal" component={BudgetMealScreen} />
        <Stack.Screen name="WhatCanICook" component={WhatCanICookScreen} />
        <Stack.Screen name="WeeklyReport" component={WeeklyReportScreen} />
        <Stack.Screen name="MoodEnergy" component={MoodEnergyScreen} />
        <Stack.Screen name="RamadanMode" component={RamadanModeScreen} />

        {/* Profile flow */}
        <Stack.Screen name="HealthProfileEdit" component={HealthProfileEditScreen} />
        <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} />
        <Stack.Screen name="ChildProfile" component={ChildProfileScreen} />
        <Stack.Screen name="DiabetesMode" component={DiabetesModeScreen} />
        <Stack.Screen name="PregnancyMode" component={PregnancyModeScreen} />
        <Stack.Screen name="ShasthoShebikaPortal" component={ShasthoShebikaPortalScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Consent" component={ConsentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
