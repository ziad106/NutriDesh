import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

const Tab = createBottomTabNavigator();

function ScanPlaceholder() {
  return <View />;
}

function FAB({ onPress }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.fab}>
      <Text style={styles.fabIcon}>📷</Text>
    </TouchableOpacity>
  );
}

function TabIcon({ emoji, label, focused }) {
  return (
    <View style={styles.tabBox}>
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label={STRINGS.HOME} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ScanTab"
        component={ScanPlaceholder}
        options={({ navigation }) => ({
          tabBarButton: () => <FAB onPress={() => navigation.navigate('Scan')} />,
        })}
      />
      <Tab.Screen
        name="ChatTab"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label={STRINGS.CHAT} focused={focused} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label={STRINGS.PROFILE} focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.cardSurface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 78,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tabBox: { alignItems: 'center', justifyContent: 'center', minWidth: 56 },
  tabIcon: { fontSize: 22, opacity: 0.55 },
  tabIconFocused: { opacity: 1 },
  tabLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  tabLabelFocused: { color: COLORS.forestGreen, fontWeight: '700' },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    shadowColor: COLORS.forestGreen,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: { fontSize: 28 },
});
