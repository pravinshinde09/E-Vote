import { Query } from 'appwrite';
import { APPWRITE_DATABASE_ID, databases, POSTS_COLLECTION_ID } from '../appwrite/appWriteConfig';
import { sendNotification } from './sendPushNotification';

export const createPost = async (post: any) => {
  try {
    const response = await databases.createDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, 'unique()', post);

    const title = 'New Post';
    const message = `A new post titled "${post.title}" has been created.`;
    await sendNotification({ title, message });

    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const getPost = async (postID: string): Promise<any> => {
  try {
    const response = await databases.getDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postID);
    return response;
  } catch (error) {
    console.error('Error getting Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const updatePost = async (postID: string, updatedData: any) => {
  try {
    const response = await databases.updateDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postID, updatedData);
    return response;
  } catch (error) {
    console.error('Error updating Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const updatePostStatus = async (postID: string, status: { isApproved?: boolean, isDisApproved?: boolean }) => {
  try {
    const response = await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      POSTS_COLLECTION_ID,
      postID,
      status
    );
    return response;
  } catch (error) {
    console.error('Error updating Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const deletePost = async (postID: string) => {
  try {
    const response = await databases.deleteDocument(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, postID);
    return response;
  } catch (error) {
    console.error('Error deleting Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const listPostsByUser = async (userId: string) => {
  try {
    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, [
      Query.equal('userId', userId),
    ]);
    return response.documents;
  } catch (error) {
    console.error('Error listing Posts:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const listPostsByStatus = async (
  isApproved: boolean,
  isDisApproved?: boolean,
  organizationId?: string,
) => {
  try {
    const queries = [
      Query.equal('isApproved', isApproved)
    ];

    if (organizationId) {
      queries.push(Query.equal('organizationId', organizationId));
    }

    if (isDisApproved !== undefined) {
      queries.push(Query.equal('isDisApproved', isDisApproved));
    }

    const response = await databases.listDocuments(APPWRITE_DATABASE_ID, POSTS_COLLECTION_ID, queries);
    return response.documents;
  } catch (error) {
    console.error('Error listing Posts by status:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const listApprovedPosts = async (isApproved: boolean, organizationId?: string) => {
  return listPostsByStatus(isApproved, undefined, organizationId);
};

export const listDisapprovedPosts = async (isDisApproved: boolean, organizationId?: string) => {
  return listPostsByStatus(false, isDisApproved, organizationId);
};