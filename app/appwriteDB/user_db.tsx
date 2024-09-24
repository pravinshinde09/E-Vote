import { AppwriteException, Query } from "appwrite";
import { account, APPWRITE_USER_COLLECTION_ID, APPWRITE_DATABASE_ID, databases } from "../appwrite/appWriteConfig";
import { UserData } from "../components/Profile/Type";

class UserDatabaseService {

  async checkSession() {
    try {
      const session = await account.get();
      return session;
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    }
  }

  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }

      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID,
        userId
      );
      return response;
    } catch (error) {
      if (error instanceof AppwriteException && error.message.includes("Document with the requested ID could not be found")) {
        return null;
      }
      console.log("DatabaseService :: getUserProfile : ", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async saveUserProfile(userId: string, userData: UserData): Promise<void> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID,
        userId,
        userData
      );
      console.log(`User ${userId} saved to database.`);
    } catch (error) {
      console.log("DatabaseService :: saveUserToDatabase : ", error);
      throw error;
    }
  }

  async editUserProfile(userId: string, updatedData: Partial<UserData>): Promise<void> {
    try {
      const session = await this.checkSession();
      if (!session) {
        throw new Error("User is not authenticated");
      }
      const existingData = await this.getUserProfile(userId);
      if (!existingData) {
        throw new Error(`User with ID ${userId} not found`);
      }

      const validFields: (keyof UserData)[] = ["name", "email", "phoneNumber", "imageUrl", "imageId", "bio", "expoPushToken", 'organizationId'];
      const filteredData: Partial<UserData> = {};

      for (const key in updatedData) {
        if (validFields.includes(key as keyof UserData)) {
          filteredData[key as keyof UserData] = updatedData[key as keyof UserData];
          console.log("updated Data: ", updatedData);
        }
      }

      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID,
        userId,
        filteredData
      );

      console.log(`User profile updated for ${userId}`);
    } catch (error) {
      console.error("DatabaseService :: editUserProfile : ", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async updateUserOrganizationId(userId: string, organizationId: string): Promise<void> {
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID,
        userId,
        { organizationId }
      );

      console.log(`User profile updated for ${userId}`);

    } catch (error) {
      console.error("DatabaseService :: updateUserOrganizationId : ", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getAllUserTotal(): Promise<number> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID
      );

      const totalUsers = response.total;
      return totalUsers;
    } catch (error) {
      console.error("DatabaseService :: getAllUser : ", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
  async getAllUser(): Promise<any[]> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID
      );

      return response.documents;
    } catch (error) {
      console.error("DatabaseService :: getAllUser : ", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getAllUserTokens(): Promise<string[]> {
    try {
      const users = await this.getAllUser();
      return users.map((user: { expoPushToken: any; }) => user.expoPushToken).filter((token: any) => token);
    } catch (error) {
      console.error("DatabaseService :: getAllUserTokens : ", error);
      throw error;
    }
  }

  async getUserIdByToken(token: string): Promise<string | null> {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        APPWRITE_USER_COLLECTION_ID,
        [Query.equal('expoPushToken', token)]
      );

      if (response.documents.length > 0) {
        const userDoc = response.documents[0];
        return userDoc.userId || null;
      }

      return null;
    } catch (error) {
      console.error('Error fetching user ID by token:', error);
      throw error;
    }
  }
}

export default UserDatabaseService;
