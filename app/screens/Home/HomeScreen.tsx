import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, StatusBar, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { ProfileIcon } from '../../assets';
import { RADIUS, SPACING } from '../../theme';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Typography from '../../components/Typography';
import { type StyleProps, useTheme } from '../../context/ThemeProvider';
import PostList from "../../components/Post/PostList";
import UserDatabaseService from "../../appwriteDB/user_db";
import { account } from "../../appwrite/appWriteConfig";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUnreadNotificationCount } from '../../appwriteDB/sendPushNotification';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colorScheme, colors } = useTheme();
  const styles = getStyles({ colors });
  const [imageUrl, setImageUrl] = useState<string>();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const userDatabaseService = new UserDatabaseService();

  const fetchUnreadCount = async () => {
    try {
      const user = await account.get();
      const userId = user.$id;
      const count = await getUnreadNotificationCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUnreadCount();
    }, [])
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await account.get();
        const userId = user.$id;
        const userProfile = await userDatabaseService.getUserProfile(userId);
        setImageUrl(userProfile.imageUrl);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.background} barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('OrganizationInfo' as never)}>
            <View style={styles.logoStyle}>
              <Image source={require('../../assets/Images/voter.png')} style={styles.logo} />
              <Typography variant='title02'>E-VOTING</Typography>
            </View>
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications' as never)}>
              <View style={styles.notificationIconContainer}>
                <Ionicons name="notifications-outline" size={32} color={colors.icon} />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.userImage} />
              ) : (
                <ProfileIcon color={colors.icon} style={styles.IconStyle} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginVertical: SPACING.spacing03, height:'100%' }}>
          <PostList />
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: SPACING.spacing02,
    position: 'relative',
    paddingBottom: SPACING.spacing04
  },
  headerContainer: {
    marginTop: SPACING.spacing03,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.spacing01,
  },
  logo: {
    width: 40,
    height: 40,
    objectFit: 'contain',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.spacing03
  },
  notificationIconContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  IconStyle: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    paddingBottom: SPACING.spacing03
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderRadius: RADIUS.extra_small,
    marginVertical: SPACING.spacing02,
    zIndex: 1,
    borderWidth: 2,
    borderColor: colors.gray100,
    paddingLeft: SPACING.spacing03,
    backgroundColor: colors.inputBox,
  },
  voiceSearchIcon: {
    position: 'absolute',
    zIndex: 1,
    right: SPACING.spacing03,
    color: colors.icon,
    paddingTop: SPACING.spacing01,
    top: SPACING.spacing05
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.full
  }
});

export default HomeScreen;
