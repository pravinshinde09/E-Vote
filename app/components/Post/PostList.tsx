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
import { getOrganizationId } from '../../appwriteDB/organizationInfo_db';

const PostList = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserData | null }>({});
  const userDatabaseService = new UserDatabaseService();
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const getAllUserTotal = async () => {
      try {
        const response = await userDatabaseService.getAllUserTotal();
        setTotalUsers(response || 0);
      } catch (error) {
        console.log('Error occurred while fetching total user count.');
      }
    };
    getAllUserTotal();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const isApproved = false;
      const isDisApproved = false;
  
      // Fetch organizationId, can be null
      const organizationId = await getOrganizationId();
      
      // If organizationId is not available, get the current user's ID
      const user = await account.get();
      const userId = user.$id;
  
      let response;
  
      if (organizationId) {
        response = await listPostsByStatus(isApproved, isDisApproved, organizationId);
      } else {
        response = await listPostsByUser(userId);
      }
  
      // Sort posts by timestamp
      response.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
      // Map and set posts
      const formattedPosts = mapPostResponse(response);
      setPosts(formattedPosts);
  
      // Fetch user profiles for all posts
      const profiles: { [key: string]: UserData | null } = {};
      for (const post of formattedPosts) {
        const profile = await fetchUserProfile(post.userId);
        profiles[post.userId] = profile;
      }
      setUserProfiles(profiles);
  
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    showAlert({
      title: "Post Like",
      message: "Are you sure you want to like this post?",
      onConfirm: async () => {
        try {
          const user = await account.get();
          const userId = user.$id;
          const updatedPost = (await likePost(postId, userId)) as unknown as PostData;
          setPosts(posts.map((post) => (post.$id === postId ? updatedPost : post)));
        } catch (err) {
          console.error("Error liking post:", err);
          Alert.alert("Error", "Failed to like post");
        }
      },
      confirmText: "Like"
    });
  };

  const handleDislike = async (postId: string) => {
    showAlert({
      title: "Post Dislike",
      message: "Are you sure you want to dislike this post?",
      onConfirm: async () => {
        try {
          const user = await account.get();
          const userId = user.$id;
          const updatedPost = (await dislikePost(postId, userId)) as unknown as PostData;
          setPosts(posts.map((post) => (post.$id === postId ? updatedPost : post)));
        } catch (err) {
          console.error("Error disliking post:", err);
          Alert.alert("Error", "Failed to dislike post");
        }
      },
      confirmText: "Dislike"
    });
  };

  const handleNeutral = async (postId: string) => {
    showAlert({
      title: "Neutral",
      message: "Are you sure you want to set this post to neutral?",
      onConfirm: async () => {
        try {
          const user = await account.get();
          const userId = user.$id;
          const updatedPost = (await neutralPost(postId, userId)) as unknown as PostData;
          setPosts(posts.map((post) => (post.$id === postId ? updatedPost : post)));
        } catch (err) {
          console.error("Error setting post to neutral:", err);
          Alert.alert("Error", "Failed to set post to neutral");
        }
      },
      confirmText: "Neutral"
    });
  };

  const fetchUserProfile = async (userId: string): Promise<UserData | null> => {
    try {
      const userProfile = await userDatabaseService.getUserProfile(userId);
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const updatePost = async (postId: string, isApproved?: boolean, isDisApproved?: boolean) => {
    try {

      const statusUpdate: { isApproved?: boolean; isDisApproved?: boolean } = {};

      if (isApproved !== undefined) {
        statusUpdate.isApproved = isApproved;
      }

      if (isDisApproved !== undefined) {
        statusUpdate.isDisApproved = isDisApproved;
      }

      if (Object.keys(statusUpdate).length > 0) {
        await updatePostStatus(postId, statusUpdate);
      }
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };


  const calculatePercentage = (count: number): number => (totalUsers > 0 ? (count / totalUsers) * 100 : 0);

  const renderItem = ({ item }: { item: PostData }) => {
    const likePercentage = calculatePercentage(item.like?.length || 0);
    const disLikePercentage = calculatePercentage(item.disLike?.length || 0);

    // Update post based on like and dislike percentages
    if (likePercentage > 50 && !item.isApproved) {
      updatePost(item.$id, true);
    }
    if (disLikePercentage > 50 && !item.isDisApproved) {
      updatePost(item.$id, undefined, true);
    }

    return (
      <PostCard
        post={item}
        userProfile={userProfiles[item.userId] || null}
        handleLike={handleLike}
        handleDislike={handleDislike}
        handleNeutral={handleNeutral}
        totalUser={totalUsers}
      />
    );
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
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

