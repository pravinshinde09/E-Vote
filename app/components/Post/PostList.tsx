import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, FlatList, View, Alert, RefreshControl } from 'react-native';
import { PostData } from '../../types/type';
import { listPostsByStatus, listPostsByUser, updatePostStatus } from '../../appwriteDB/post_db';
import { dislikePost, likePost, neutralPost } from '../../appwriteDB/postInteraction';
import { account } from '../../appwrite/appWriteConfig';
import { mapPostResponse } from '../../utils/postMapper';
import { SPACING } from '../../theme';
import UserDatabaseService from '../../appwriteDB/user_db';
import { UserData } from '../Profile/Type';
import showAlert from '../Alert';
import PostCard from './PostCard';
import Loading from '../Loading';
import { useUserOrg } from '../../context/userOrgContext';
import { useLanguage } from '../../context/LocalizationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserData | null }>({});
  const userDatabaseService = new UserDatabaseService();
  const { organizationId } = useUserOrg();
  const { translate } = useLanguage();
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // Fetch total users on mount
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await userDatabaseService.getTotalUsers(organizationId);
        setTotalUsers(response || 0);
      } catch (error) {
        console.error('Error fetching total user count:', error);
      }
    };
    fetchTotalUsers();
  }, [organizationId]);

  // Fetch posts on mount or refresh
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const user = await account.get();
      const userId = user.$id;

      // Retrieve organization ID from AsyncStorage or context
      const storedOrg = await AsyncStorage.getItem('organizationDetails');
      const orgId = storedOrg ? JSON.parse(storedOrg).$id : organizationId;

      // Fetch posts based on organization ID or user ID
      const isApproved = false;
      const isDisApproved = false;
      const response = orgId
        ? await listPostsByStatus(isApproved, isDisApproved, orgId)
        : await listPostsByUser(userId);

      // Sort posts by timestamp
      response.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      // Map posts and update statuses
      const formattedPosts = mapPostResponse(response);
      formattedPosts.forEach((post) => {
        const likePercentage = calculatePercentage(post.like?.length || 0);
        const disLikePercentage = calculatePercentage(post.disLike?.length || 0);

        if (likePercentage > 50 && !post.isApproved) updatePost(post.$id, true);
        if (disLikePercentage > 50 && !post.isDisApproved) updatePost(post.$id, undefined, true);
      });

      // Fetch user profiles concurrently
      const profilePromises = formattedPosts.map((post) => fetchUserProfile(post.userId));
      const profilesArray = await Promise.all(profilePromises);
      const profiles = formattedPosts.reduce((acc, post, index) => {
        acc[post.userId] = profilesArray[index];
        return acc;
      }, {});
      setUserProfiles(profiles);

      setPosts(formattedPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<UserData | null> => {
    try {
      return await userDatabaseService.getUserProfile(userId);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const updatePost = async (postId: string, isApproved?: boolean, isDisApproved?: boolean) => {
    try {
      const statusUpdate: { isApproved?: boolean; isDisApproved?: boolean } = {};
      if (isApproved !== undefined) statusUpdate.isApproved = isApproved;
      if (isDisApproved !== undefined) statusUpdate.isDisApproved = isDisApproved;
      if (Object.keys(statusUpdate).length > 0) await updatePostStatus(postId, statusUpdate);
    } catch (error) {
      console.error('Error updating post status:', error);
    }
  };

  const calculatePercentage = (count: number): number =>
    totalUsers > 0 ? (count / totalUsers) * 100 : 0;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: PostData }) => (
      <PostCard
        post={item}
        userProfile={userProfiles[item.userId] || null}
        handleLike={handleLike}
        handleDislike={handleDislike}
        handleNeutral={handleNeutral}
        totalUser={totalUsers}
      />
    ),
    [userProfiles, posts, totalUsers]
  );

  const handleLike = async (postId: string) => {
    showAlert({
      title: translate('post_agree'),
      message: translate('post_agree_msg'),
      cancelText: translate('cancel'),
      confirmText: translate('agree'),
      onConfirm: async () => handlePostInteraction(postId, likePost),
    });
  };

  const handleDislike = async (postId: string) => {
    showAlert({
      title: translate('post_disAgree'),
      message: translate('post_disAgree_msg'),
      cancelText: translate('cancel'),
      confirmText: translate('disAgree'),
      onConfirm: async () => handlePostInteraction(postId, dislikePost),
    });
  };

  const handleNeutral = async (postId: string) => {
    showAlert({
      title: translate('post_neutral'),
      message: translate('post_neutral_msg'),
      cancelText: translate('cancel'),
      confirmText: translate('neutral'),
      onConfirm: async () => handlePostInteraction(postId, neutralPost),
    });
  };

  const handlePostInteraction = async (postId: string, action: Function) => {
    try {
      const user = await account.get();
      const updatedPost = (await action(postId, user.$id)) as PostData;
      setPosts(posts.map((post) => (post.$id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error updating post interaction:', err);
      Alert.alert('Error', 'Failed to update post interaction.');
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.$id}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.spacing01,
    paddingTop: SPACING.spacing02,
    paddingBottom: SPACING.spacing04,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostList;
