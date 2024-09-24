import { APPWRITE_DATABASE_ID, ORGANIZATION_COLLECTION_ID, databases } from "../appwrite/appWriteConfig";
import UserDatabaseService from "./user_db";

export type organizationData = {
    $id?: string,
    userId: string,
    name: string,
    details: string
};

export const createOrganization = async (organizationInfo: organizationData) => {
    try {
        const response = await databases.createDocument(APPWRITE_DATABASE_ID, ORGANIZATION_COLLECTION_ID, 'unique()', organizationInfo);
        return response;
    } catch (error) {
        console.log('Error occurred while creating organization:', error);
        throw error;
    }
};

export const listOrganization = async (organizationId: string): Promise<any> => {
    try {
        const response = await databases.getDocument(APPWRITE_DATABASE_ID, ORGANIZATION_COLLECTION_ID, organizationId);
        return response;
    } catch (error) {
        console.log('Error occurred while getting organization details:', error);
        throw error;
    }
};

export const updateOrganization = async (organizationId: string, updatedOrganizationInfo: Partial<organizationData>) => {
    try {
        const response = await databases.updateDocument(APPWRITE_DATABASE_ID, ORGANIZATION_COLLECTION_ID, organizationId, updatedOrganizationInfo);
        return response;
    } catch (error) {
        console.log('Error occurred while updating organization details:', error);
        throw error;
    }
};

export const deleteOrganization = async (organizationId: string) => {
    try {
        const response = await databases.deleteDocument(APPWRITE_DATABASE_ID, ORGANIZATION_COLLECTION_ID, organizationId);
        return response;
    } catch (error) {
        console.log('Error occurred while deleting organization:', error);
        throw error;
    }
};

export const getOrganizationId = async (): Promise<string | null> => {
    const userDatabaseService = new UserDatabaseService();
    try {
        const user = await userDatabaseService.checkSession();
        if (!user?.$id) {
            console.warn('User not found or session expired.');
            return null;
        }

        const userId = user.$id;
        const userProfile = await userDatabaseService.getUserProfile(userId);

        if (userProfile?.organizationId) {
            return userProfile.organizationId;
        } else {
            console.log('Organization ID not found.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching organization ID:', error);
        return null;
    }
};

