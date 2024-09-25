import { Models } from 'appwrite';
import { PostData } from '../types/type';

export const mapPostResponse = (response: Models.Document[]): PostData[] => {
  return response.map((document) => ({
    $id: document.$id,
    title: document.title,
    details: document.details,
    userId: document.userId,
    timestamp: document.timestamp,
    like: document.like,
    disLike: document.disLike,
    neutral: document.neutral,
    isApproved: document.isApproved,
    referencePostId: document.referencePostId,
    isDisApproved: document.isDisApproved,
    postAssets: document.postAssets
  }));
};

