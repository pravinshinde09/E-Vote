
import { APPWRITE_DATABASE_ID, databases, POSTS_ASSETS_COLLECTION_ID } from '../appwrite/appWriteConfig';
import { PostAssetData } from '../types/type';

export const createPostAssets = async (assets: PostAssetData) => {
  try {
    const response = await databases.createDocument(APPWRITE_DATABASE_ID, POSTS_ASSETS_COLLECTION_ID, 'unique()', {
      name: assets.name || '',
      fileUrl: assets.fileUrl || ''
    });
    return response;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const getPostAssets = async (assetID: string): Promise<any> => {
  try {
    const response = await databases.getDocument(APPWRITE_DATABASE_ID, POSTS_ASSETS_COLLECTION_ID, assetID);
    return response;
  } catch (error) {
    console.error('Error getting Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const updatePost = async (assetID: string, updatedData: any) => {
  try {
    const response = await databases.updateDocument(APPWRITE_DATABASE_ID, POSTS_ASSETS_COLLECTION_ID, assetID, updatedData);
    return response;
  } catch (error) {
    console.error('Error updating Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};

export const deletePost = async (assetID: string) => {
  try {
    const response = await databases.deleteDocument(APPWRITE_DATABASE_ID, POSTS_ASSETS_COLLECTION_ID, assetID);
    return response;
  } catch (error) {
    console.error('Error deleting Post:', error);
    throw new Error(error instanceof Error ? error.message : JSON.stringify(error));
  }
};
