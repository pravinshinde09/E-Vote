import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getPost } from '../appwriteDB/post_db';
import { PostData } from '../types/type';
import { UserData } from './Profile/Type';
import UserDatabaseService from '../appwriteDB/user_db';
import { SPACING, RADIUS } from '../theme';
import Typography from './Typography';
import moment from 'moment';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import Profile from '../assets/svg/Profile';

type Props = {
  referencePostId?: string;
};

const ReferencePostCard: React.FC<Props> = ({ referencePostId }) => {
  const [posts, setPosts] = useState<PostData | null>(null);
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const userDatabaseService = new UserDatabaseService();
  const { colors } = useTheme();
  const styles = getStyles({ colors });


  useEffect(() => {
    if (referencePostId) {
      const fetchReferencePosts = async () => {
        try {
          const response = await getPost(referencePostId);
          setPosts(response);
          const userId = response.userId;

          const profile = await fetchUserProfile(userId);
          setProfileData(profile);
        } catch (error) {
          console.error('Error occurred while fetching reference post:', error);
        }
      };

      fetchReferencePosts();
    } else {
      console.warn('No referencePostId provided');
    }
  }, [referencePostId]);

  const fetchUserProfile = async (userId: string): Promise<UserData | null> => {
    try {
      const userProfile = await userDatabaseService.getUserProfile(userId);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const timeAgo = (timestamp: string): string => {
    return moment(timestamp).fromNow();
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          {profileData?.imageUrl ? (
            <Image
              source={{ uri: profileData.imageUrl }}
              style={styles.userImage}
            />
          ) : (
            <Profile width={40} height={40} color={'black'} />
          )}
          <View>
            <Typography variant="title04" style={styles.username}>
              {profileData?.name || "Anonymous"}
            </Typography>
            <Typography variant="body02">
              {posts ? timeAgo(posts.timestamp) : "Just now"}
            </Typography>
          </View>
        </View>
      </View>
      <View style={{ gap: SPACING.spacing02 }}>
        <Typography variant="title04" style={{ fontWeight: '700' }}>{posts?.title}</Typography>
        <Typography variant="body01">{posts?.details}</Typography>
        {/* {posts?.imageUrl && (
          <Image source={{ uri: posts.imageUrl }} style={styles.image} />
        )} */}
      </View>
    </View>
  );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  postContainer: {
    padding: SPACING.spacing02,
    backgroundColor: colors.background,
    borderRadius: RADIUS.medium,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.spacing02,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 30,
    height: 30,
    marginRight: SPACING.spacing02,
    borderRadius: RADIUS.full
  },
  username: {
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: 'cover',
    marginBottom: SPACING.spacing02,
    borderRadius: RADIUS.medium
  },
});

export default ReferencePostCard;
