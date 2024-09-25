import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  ScrollView,
} from "react-native";
import { SPACING, RADIUS } from "../../theme";
import Setting from "../../components/Settings/Setting";
import Security from "../../components/Settings/Security";
import { type StyleProps, useTheme } from "../../context/ThemeProvider";
import { account } from "../../appwrite/appWriteConfig";
import DatabaseService from '../../appwriteDB/user_db';
import { UserData } from "../../components/Profile/Type";
import { MaterialIcons } from "@expo/vector-icons";
import Typography from "../../components/Typography";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';

const SettingScreens = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const databaseService = new DatabaseService();
  const styles = getStyles({ colors });
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;
        const userProfile = await databaseService.getUserProfile(userId);
        setUser(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Typography variant="title03">Profile Setting</Typography>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)} style={styles.profileContainer}>
          <View style={styles.profile}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                style={styles.avatar}
              />
            ) : (
              <MaterialIcons
                name="account-circle"
                size={80}
                color={colors.primary100}
              />
            )}
            <View style={{ gap: SPACING.spacing01 }}>
              <Typography variant={"title04"}>{user?.name}</Typography>
              <Typography variant={"title04"}>{user?.phoneNumber}</Typography>
            </View>
          </View>
          <AntDesign name="right" size={20} color="black" style={styles.arrowIcon} />
        </TouchableOpacity>
        <View style={styles.mainDivider} />
        <Setting />
        <View style={styles.mainDivider} />
        <Security />
        <View style={styles.mainDivider} />
      </View>
    </ScrollView>
  );
};

const getStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: SPACING.spacing03,
      paddingTop: SPACING.spacing03,
      gap: SPACING.spacing03,
      backgroundColor: colors.background,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: RADIUS.full,
    },
    mainDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
      width: "100%",
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    profile: {
      flexDirection: 'row',
      gap: SPACING.spacing03,
      alignItems: 'center',
    },
    arrowIcon: {
      color: colors.icon,
    },
  });

export default SettingScreens;
