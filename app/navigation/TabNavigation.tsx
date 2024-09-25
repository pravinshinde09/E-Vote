import React from "react";
import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase } from '@react-navigation/native';
import { CreatePost, HomeIcon, ThumbDown, ThumbsUp, Search } from '../assets';
import StackNavigation from './HomeScreenNavigation';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import SearchScreen from "../screens/Search/Search";
import DisAgreePost from "../screens/DisAgreePost/DisAgreePost";
import AppealScreen from "../screens/Appeal/AppealScreen";
import { AntDesign } from '@expo/vector-icons';
import CreatePostScreenNavigation from "./CreatePostScreenNavigation";
import { SPACING } from "../theme";
import UserOrgProvider from "../context/userOrgContext";

export type RootStackParamList = {
  HomeScreen: undefined;
  Home: undefined;
  PostCreation: {
    screen?: 'CreateAppeal';
    params?: { postId: string };
  };
  Approved: undefined;
  Setting: undefined;
  DisApproved: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const BottomNavigator = () => {
  const { colors } = useTheme();
  const styles = getStyles({ colors });

  const handleTabPress = (routeName: keyof RootStackParamList,
    targetScreen: string) => ({ navigation }:
      { navigation: BottomTabNavigationProp<ParamListBase> }) => ({
        tabPress: (e: { preventDefault: () => void }) => {
          const state = navigation.getState();
          if (state) {
            const nonTargetRoute = state.routes.find(
              (route) => route.name === routeName && route.state && (route.state.index ?? 0) > 0
            );
            if (nonTargetRoute) {
              e.preventDefault();
              navigation.navigate(targetScreen, { screen: targetScreen });
            }
          }
        },
      });

  return (
    <UserOrgProvider>
      <Tab.Navigator
        initialRouteName="HomeScreen"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background, // Set the header background color here
          },
          headerTintColor: colors.text,
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.icon,
          tabBarStyle: {
            backgroundColor: colors.background,
            height: 60,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Tab.Screen
          name="Home"
          component={StackNavigation}
          options={{
            tabBarIcon: ({ color }) => (
              <HomeIcon style={styles.IconStyle} color={color} />
            ),
          }}
          listeners={handleTabPress('HomeScreen', 'Home')}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Search style={styles.IconStyle} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="PostCreation"
          component={CreatePostScreenNavigation}
          options={{
            tabBarIcon: ({ color }) => (
              <CreatePost style={styles.CreateIconStyle} color={color} />
            ),
            tabBarLabel: () => null,
          }}
          listeners={handleTabPress('PostCreation', 'CreatePost')}
        />
        <Tab.Screen
          name="Approved"
          component={AppealScreen}
          options={({ navigation }) => ({
            tabBarIcon: ({ color }) => (
              <ThumbsUp style={styles.IconStyle} color={color} />
            ),
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowIconStyle}>
                <AntDesign name="arrowleft" size={24} style={styles.IconStyle} />
              </TouchableOpacity>
            ),
          })}
        />
        <Tab.Screen
          name="DisApproved"
          component={DisAgreePost}
          options={({ navigation }) => ({
            tabBarIcon: ({ color }) => (
              <ThumbDown style={styles.IconStyle} color={color} />
            ),
            headerShown: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowIconStyle}>
                <AntDesign name="arrowleft" size={24} style={styles.IconStyle} />
              </TouchableOpacity>
            ),
          })}
        />
      </Tab.Navigator>
    </UserOrgProvider>
  );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  IconStyle: {
    width: 24,
    height: 24,
    color: colors.icon
  },
  CreateIconStyle: {
    width: 54,
    height: 54,
  },
  arrowIconStyle: {
    marginLeft: SPACING.spacing03,
  },
});

export default BottomNavigator;
