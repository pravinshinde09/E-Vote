import { APPWRITE_DATABASE_ID, databases, POSTS_COLLECTION_ID } from '../appwrite/appWriteConfig';
import { getPost } from './post_db';

export const likePost = async (postId: string, userId: string) => {
  try {
    const post = await getPost(postId);

    const like = post.like || [];
    const disLike = post.disLike || [];
    const neutral = post.neutral || [];

    if (!like.includes(userId)) {
      like.push(userId);
    }

    const updatedDisLike = disLike.filter((id: string) => id !== userId);
    const updatedNeutral = neutral.filter((id: string) => id !== userId);

    const updatedPost = await databases.updateDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postId, {
      like,
      disLike: updatedDisLike,
      neutral: updatedNeutral,
    });

    return updatedPost;
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const dislikePost = async (postId: string, userId: string) => {
  try {
    const post = await getPost(postId);

    const like = post.like || [];
    const disLike = post.disLike || [];
    const neutral = post.neutral || [];

    if (!disLike.includes(userId)) {
      disLike.push(userId);
    }

    const updatedLikes = like.filter((id: string) => id !== userId);
    const updatedNeutral = neutral.filter((id: string) => id !== userId);

    const updatedPost = await databases.updateDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postId, {
      like: updatedLikes,
      disLike,
      neutral: updatedNeutral,
    });

    return updatedPost;
  } catch (error) {
    console.error('Error disliking post:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const neutralPost = async (postId: string, userId: string) => {
  try {
    const post = await getPost(postId);

    const like = post.like || [];
    const disLike = post.disLike || [];
    const neutral = post.neutral || [];

    if (!neutral.includes(userId)) {
      neutral.push(userId);
    }

    const updatedLikes = like.filter((id: string) => id !== userId);
    const updatedDisLike = disLike.filter((id: string) => id !== userId);

    const updatedPost = await databases.updateDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postId, {
      like: updatedLikes,
      disLike: updatedDisLike,
      neutral,
    });

    return updatedPost;
  } catch (error) {
    console.error('Error neutral post:', error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
