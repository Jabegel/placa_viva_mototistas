import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './context/UserContext';

import LoginScreen from './screens/LoginScreen';
import VerifyCodeScreen from './screens/VerifyCodeScreen';
import WelcomeNameScreen from './screens/WelcomeNameScreen';
import CitySelectScreen from './screens/CitySelectScreen';
import StationSelectScreen from './screens/StationSelectScreen';
import CouponsScreen from './screens/CouponsScreen';
import CouponDetailScreen from './screens/CouponDetailScreen';
import ShareScreen from './screens/ShareScreen';
import LifestyleScreen from './screens/LifestyleScreen';
import LifestyleCouponScreen from './screens/LifestyleCouponScreen';
import ProfileScreen from './screens/ProfileScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import VehiclesScreen from './screens/VehiclesScreen';
import VehicleDetailScreen from './screens/VehicleDetailScreen';
// ── Módulo PRO Caminhoneiro ──
import TruckStationsScreen from './screens/TruckStationsScreen';
import TruckCouponsScreen from './screens/TruckCouponsScreen';
import TruckHistoryScreen from './screens/TruckHistoryScreen';
import TruckReceiptScreen from './screens/TruckReceiptScreen';
import TruckBenefitsScreen from './screens/TruckBenefitsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
          {/* Fluxo principal */}
          <Stack.Screen name="Login"           component={LoginScreen} />
          <Stack.Screen name="VerifyCode"      component={VerifyCodeScreen} />
          <Stack.Screen name="WelcomeName"     component={WelcomeNameScreen} />
          <Stack.Screen name="CitySelect"      component={CitySelectScreen} />
          <Stack.Screen name="StationSelect"   component={StationSelectScreen} />
          <Stack.Screen name="Coupons"         component={CouponsScreen} />
          <Stack.Screen name="CouponDetail"    component={CouponDetailScreen} />
          <Stack.Screen name="Share"           component={ShareScreen} />
          <Stack.Screen name="Lifestyle"       component={LifestyleScreen} />
          <Stack.Screen name="LifestyleCoupon" component={LifestyleCouponScreen} />
          {/* Perfil */}
          <Stack.Screen name="Profile"         component={ProfileScreen} />
          <Stack.Screen name="PersonalInfo"    component={PersonalInfoScreen} />
          <Stack.Screen name="Vehicles"        component={VehiclesScreen} />
          <Stack.Screen name="VehicleDetail"   component={VehicleDetailScreen} />
          {/* PRO — Caminhoneiro */}
          <Stack.Screen name="TruckStations"   component={TruckStationsScreen} />
          <Stack.Screen name="TruckCoupons"    component={TruckCouponsScreen} />
          <Stack.Screen name="TruckHistory"    component={TruckHistoryScreen} />
          <Stack.Screen name="TruckReceipt"    component={TruckReceiptScreen} />
          <Stack.Screen name="TruckBenefits"   component={TruckBenefitsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
    </SafeAreaProvider>
  );
}
