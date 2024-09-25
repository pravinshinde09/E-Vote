import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home/HomeScreen';
import { useTheme } from '../context/ThemeProvider';
import { Platform } from "react-native";
import { RADIUS } from "../theme";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ChangeCurrency from "../components/Settings/ChangeCurrency";
import ScreenLock from "../components/Settings/ScreenLock";
import SelectLanguage from "../components/Settings/SelectLanguage";
import Theme from "../components/Theme";
import SettingScreens from "../screens/Setting/SettingScreen";
import DisAgreePost from "../screens/DisAgreePost/DisAgreePost";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Notification from "../components/Notification";
import OrganizationInfo from "../screens/OrganizationInfo/o/OrganizationInfo";
import OrganizationCreation from "../components/organization/CreateOrganization";
import UpdateOrganization from "../components/organization/UpdateOrganization";

export type HomeStackParamList = {
  HomeScreen: undefined;
  Profile: undefined;
  Settings: undefined;
  SelectLanguage: undefined;
  ChangeCurrency: undefined;
  Theme: undefined;
  ScreenLock: undefined;
  DisAgreePost: undefined;
  Notifications: undefined;
  OrganizationInfo: undefined;
  CreateOrganization: undefined;
  UpdateOrganization: undefined
};

const Stack = createStackNavigator<HomeStackParamList>();

const HomeScreenNavigation = () => {
  const { colors } = useTheme();

  return (
    <BottomSheetModalProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: [{
            backgroundColor: colors.background,
          },
          Platform.OS === 'ios' && {
            shadowRadius: RADIUS.small,
          },
          ],
          headerTintColor: colors.text,
          headerTitleAlign: 'center',
          cardStyle: { backgroundColor: colors.background },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingScreens}
          options={{
            headerTitle: 'Settings',
          }}
        />
        <Stack.Screen
          name="SelectLanguage"
          component={SelectLanguage}
          options={{
            headerTitle: 'Language',
          }}
        />
        <Stack.Screen
          name="ChangeCurrency"
          component={ChangeCurrency}
          options={{
            headerTitle: 'Currency',
          }}
        />
        <Stack.Screen
          name="Theme"
          component={Theme}
        />
        <Stack.Screen
          name="ScreenLock"
          component={ScreenLock}
        />
        <Stack.Screen
          name="DisAgreePost"
          component={DisAgreePost}
        />
        <Stack.Screen
          name="Notifications"
          component={Notification}
        />
        <Stack.Screen
          name="OrganizationInfo"
          component={OrganizationInfo}
        />
        <Stack.Screen
          name="CreateOrganization"
          component={OrganizationCreation}
        />
        <Stack.Screen
          name="UpdateOrganization"
          component={UpdateOrganization}
        />
      </Stack.Navigator>
    </BottomSheetModalProvider>
  );
};

export default HomeScreenNavigation;
