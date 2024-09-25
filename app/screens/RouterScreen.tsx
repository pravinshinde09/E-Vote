import { ImageBackground, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import UserDatabaseService from '../appwriteDB/user_db';
import CreateProfile from '../components/Profile/CreateProfile';
import BottomNavigator from '../navigation/TabNavigation';
import Loading from '../components/Loading';

const RouterScreen = () => {
  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const userDatabaseService = new UserDatabaseService();

  const fetchUserProfile = async () => {
    try {
      const user = await userDatabaseService.checkSession();
      const userId = user?.$id;
      if (userId) {
        const userProfile = await userDatabaseService.getUserProfile(userId);
        if (userProfile && userProfile.name && userProfile.email.trim()) {
          setIsProfileComplete(true);
        } else {
          setIsProfileComplete(false);
        }
      } else {
        setIsProfileComplete(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setIsProfileComplete(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileCreated = () => {
    setIsProfileComplete(true);
  };

  if (isProfileComplete === null) {
    return (
      <ImageBackground source={require('../../assets/images/landing.png')} style={styles.background}>
        <Loading />
      </ImageBackground>
    );
  }

  return (
    <View style={styles.container}>
      {isProfileComplete ? (
        <BottomNavigator />
      ) : (
        <CreateProfile onProfileCreated={handleProfileCreated} />
      )}
    </View>
  );
};

export default RouterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
});
