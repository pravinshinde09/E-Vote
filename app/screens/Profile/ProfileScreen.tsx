import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SPACING } from "../../theme";
import Button from "../../components/Button";
import { useLanguage } from "../../context/LocalizationContext";
import { ScrollView } from "react-native-gesture-handler";
import PersonalDetails from "../../components/Profile/PersonalDetails";
import { useAuthContext } from "../../appwrite/AppwriteContext";
import { type StyleProps, useTheme } from "../../context/ThemeProvider";
import DatabaseService from '../../appwriteDB/user_db'
import { UserData } from "../../components/Profile/Type";
import Setting from "../../assets/svg/Setting";
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const databaseService = new DatabaseService();
  const navigation = useNavigation();
  const { appwrite, setIsLoggedIn } = useAuthContext();
  const [userData, setUserData] = useState<UserData>({
    $id: '',
    name: '',
    email: '',
    phoneNumber: '',
    imageUrl: '',
    imageId: '',
    bio: '',
    expoPushToken: '',
    organizationId: '',
  });
  const handleSignOut = useCallback(async () => {
    try {
      await appwrite.logout()
        .then(() => {
          setIsLoggedIn(false)
        })
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await appwrite.getCurrentUser();
        if (user) {
          const userProfile = await databaseService.getUserProfile(user.$id);
          if (userProfile) {
            const userObj: UserData = {
              $id: userProfile.$id,
              name: userProfile.name || '',
              email: userProfile.email || '',
              phoneNumber: userProfile.phoneNumber || '',
              imageUrl: userProfile.imageUrl || '',
              imageId: userProfile.imageId || '',
              bio: userProfile.bio || '',
              expoPushToken: userProfile.expoPushToken || '',
              organizationId: userProfile.organizationId || '',
            };
            setUserData(userObj);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditProfile = async (updatedData: Partial<UserData>) => {
    const updatedUserData = { ...userData, ...updatedData };
    if (!updatedUserData.$id) {
      console.error("Error: User ID is missing.");
      return;
    }
    setUserData(updatedUserData);

    try {
      await databaseService.editUserProfile(updatedUserData.$id, updatedUserData);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const { translate } = useLanguage();
  const { colors } = useTheme();
  const styles = getStyles({ colors });

  return (
    <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)} >
          <View style={styles.settingIcon}>
            <Setting style={styles.settingIcon} color={colors.icon} />
          </View>
        </TouchableOpacity>
        <PersonalDetails userData={userData} onUpdateProfile={handleEditProfile} />
        <View style={styles.mainDivider} />
        <View style={styles.profileActions}>
          <Button onPress={handleSignOut} variant="primary" fullwidth>
            {translate("sign_out")}
          </Button>
        </View>
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
    profileActions: {
      marginVertical: SPACING.spacing03,
      marginBottom: SPACING.spacing05,
    },
    mainDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.icon,
      width: "100%",
    },
    settingIcon: {
      alignSelf: 'flex-end'
    }
  });

export default ProfileScreen;
