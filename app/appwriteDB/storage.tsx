import { APPWRITE_PROJECT_ID, storage, APPWRITE_POST_ASSETS_BUCKET_ID, APPWRITE_AVATAR_BUCKETS_ID } from '../appwrite/appWriteConfig';
import { generateFileFormData, generateFormData } from '../utils/generateFormData';
import { appWriteStorage } from './constants/db_constants';

// ...........................................Avatar Storage Functionality...........................//

export const uploadAvatarImage = async (fileUrl: string) => {
    try {
        const formData = generateFormData(fileUrl);

        const response = await fetch(appWriteStorage.avatarUrl, {
            method: 'POST',
            headers: {
                "X-Appwrite-Project": APPWRITE_PROJECT_ID
            },
            body: formData,
        }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error uploading image: ${errorText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};

export const deleteAvatarImage = async (fileId: string) => {
    try {
        await storage.deleteFile(APPWRITE_AVATAR_BUCKETS_ID, fileId);
    } catch (error) {
        console.log('Error while deleting old image:', error);
    }
};

// ................................Post File storage functionality ..................................//

export const uploadPostFile = async (fileUrl: string, fileName: string) => {
    try {
        const formData = generateFileFormData(fileUrl, fileName);

        const response = await fetch(appWriteStorage.assetsUrl, {
            method: 'POST',
            headers: {
                "X-Appwrite-Project": APPWRITE_PROJECT_ID
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error uploading file: ${errorText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
};

export const deletePostFile = async (fileId: string) => {
    try {
        await storage.deleteFile(APPWRITE_POST_ASSETS_BUCKET_ID, fileId);
    } catch (error) {
        console.log('Error while deleting old image:', error);
    }
}

