import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../authentication/Login";
import OTPVerification from "../authentication/OTPVerification";
import { useTheme } from "../context/ThemeProvider";

export type AuthStackParamList = {
  SignUp: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyOtp: {
    userId: string,
    phoneNumber: string,
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthScreenNavigation = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        contentStyle: { backgroundColor: colors.background },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="VerifyOtp"
        component={OTPVerification}
        options={{
          // headerShown: false,
          headerTitle: '',
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthScreenNavigation;
