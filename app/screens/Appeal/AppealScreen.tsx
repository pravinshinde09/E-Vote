import { Alert, StyleSheet, View, FlatList, RefreshControl, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { listApprovedPosts } from '../../appwriteDB/post_db';
import { PostData } from '../../types/type';
import { mapPostResponse } from '../../utils/postMapper';
import { UserData } from '../../components/Profile/Type';
import UserDatabaseService from '../../appwriteDB/user_db';
import Loading from '../../components/Loading';
import { SPACING } from '../../theme';
import Card from '../../components/Card';
import { StyleProps, useTheme } from '../../context/ThemeProvider';
import { getOrganizationId } from '../../appwriteDB/organizationInfo_db';
import Typography from '../../components/Typography';

const AppealScreen = () => {
  const [postData, setPostData] = useState<PostData[]>([]);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserData | null }>({});
  const userDatabaseService = new UserDatabaseService();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { colors } = useTheme();
  const styles = getStyles({ colors });

  const fetchApprovedPosts = async () => {
    try {
      setLoading(true);
      const isApproved = true;
      const organizationId = await getOrganizationId();

      let response: any[] = [];
      if (organizationId) {
        response = await listApprovedPosts(isApproved, organizationId);
      }

      if (!response || response.length === 0) {
        setPostData([]);
        return;
      }

      response.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const responseData = mapPostResponse(response);
      setPostData(responseData);

      const profiles: { [key: string]: UserData | null } = {};
      await Promise.all(
        responseData.map(async (post) => {
          profiles[post.userId] = await fetchUserProfile(post.userId);
        })
      );

      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error occurred while fetching posts:', error);
      Alert.alert('Error', 'Error occurred while fetching posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApprovedPosts();
  }, []);

  const fetchUserProfile = async (userId: string): Promise<UserData | null> => {
    try {
      const userProfile = await userDatabaseService.getUserProfile(userId);
      return userProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApprovedPosts();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <Loading />
        </View>
      ) : postData.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Typography variant='title03' >No posts available</Typography>
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        </View>
      ) : (
        <FlatList
          data={postData}
          renderItem={({ item }) => (
            <Card postData={item} userProfile={userProfiles[item.userId] || null} />
          )}
          keyExtractor={(item) => item.$id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default AppealScreen;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.spacing01,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
