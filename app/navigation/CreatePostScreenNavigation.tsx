import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { type StyleProps, useTheme } from '../context/ThemeProvider';
import { RADIUS, SPACING } from '../theme';
import CreateAppeal from "../components/Create/CreateAppeal";
import CreatePost from "../screens/createPost/CreatePost";

export type CreatePostStackParamList = {
  CreatePost: undefined;
  CreateAppeal: {
    postId: string;
  }
};

const Stack = createStackNavigator<CreatePostStackParamList>();

const CreatePostScreenNavigation = ({ navigation }: any) => {
  const { colors } = useTheme();
  const styles = getStyles({ colors })

  return (
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

      }}
    >
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: colors.text
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowIconStyle}>
              <AntDesign name="arrowleft" size={24} style={styles.IconStyle} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="CreateAppeal"
        component={CreateAppeal}
        options={{
          headerShown: true,
          headerBackTitleVisible: false,
          headerTitleStyle: {
            color: colors.text
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrowIconStyle}>
              <AntDesign name="arrowleft" size={24} style={styles.IconStyle} />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack.Navigator>
  )
}

export default CreatePostScreenNavigation;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  IconStyle: {
    color: colors.icon
  },
  arrowIconStyle: {
    marginLeft: SPACING.spacing03
  }
})
