import * as Notifications from 'expo-notifications';
import UserDatabaseService from './user_db';
import { APPWRITE_DATABASE_ID, NOTIFICATION_COLLECTION_ID, databases } from '../appwrite/appWriteConfig';
import { Query } from 'appwrite';

// Set up notification handling for Expo
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// Function to send push notifications using Expo
const sendPushNotification = async (title: string, message: string, tokens: string[]) => {
    const messages = tokens.map(token => ({
        to: token,
        sound: 'default',
        title: title,
        body: message,
        data: { someData: 'goes here' },
    }));

    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });
    } catch (error) {
        console.error("Error sending push notification:", error);
    }
};

// Function to store notification in Appwrite database
const storeNotificationInBackend = async (userId: string, title: string, message: string, timeStamp: string) => {
    try {
        // Query to check if the notification already exists
        const existingNotifications = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            NOTIFICATION_COLLECTION_ID,
            [
                Query.equal('userId', userId),
                Query.equal('title', title)
            ]
        );

        // Check if a notification with the same title for the user already exists
        if (existingNotifications.total === 0) {
            await databases.createDocument(
                APPWRITE_DATABASE_ID,
                NOTIFICATION_COLLECTION_ID,
                'unique()',
                {
                    userId: userId,
                    title: title,
                    message: message,
                    isRead: false,
                    timeStamp: timeStamp
                }
            );
            console.log('Notification stored successfully');
        } else {
            console.log('Notification already exists');
        }
    } catch (error) {
        console.error('Error storing notification in backend:', error);
    }
};

// Function to send notifications to users
export const sendNotification = async ({ title, message }: { title: string, message: string }) => {
    try {
        const userDatabaseService = new UserDatabaseService();
        const userTokens = await userDatabaseService.getAllUserTokens();

        if (userTokens && userTokens.length > 0) {
            await sendPushNotification(title, message, userTokens);

            const storeNotificationsPromises = userTokens.map(async (token) => {
                const userId = await userDatabaseService.getUserIdByToken(token);
                if (userId) {
                    const timeStamp = new Date().toISOString();
                    await storeNotificationInBackend(userId, title, message, timeStamp);
                }
            });

            await Promise.all(storeNotificationsPromises);
        } else {
            console.log('No user tokens available.');
        }
    } catch (error) {
        console.error('Error while sending notification:', error);
    }
};

// Function to get all notifications for a user
export const getAllNotification = async (userId: string) => {
    try {
        const response = await databases.listDocuments(APPWRITE_DATABASE_ID, NOTIFICATION_COLLECTION_ID, [
            Query.equal('userId', userId)
        ]);
        return response;
    } catch (error) {
        console.log('Error occurred while fetching notification.', error);
    }
}

export const EditNotification = async (notificationId: string, isRead: boolean) => {
    try {
        const response = await databases.updateDocument(
            APPWRITE_DATABASE_ID,
            NOTIFICATION_COLLECTION_ID,
            notificationId,
            { isRead: isRead }
        );
        console.log('Notification updated successfully:');
    } catch (error) {
        console.log('Error occurred while updating notification:', error);
    }
}

export const DeleteNotification = async (notificationId: string): Promise<boolean> => {
    try {
        await databases.deleteDocument(
            APPWRITE_DATABASE_ID,
            NOTIFICATION_COLLECTION_ID,
            notificationId
        );
        console.log('Notification deleted successfully');
        return true;
    } catch (error) {
        console.log('Error occurred while deleting notification:', error);
        return false;
    }
};


export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
    try {
        const response = await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            NOTIFICATION_COLLECTION_ID,
            [Query.equal('userId', userId), Query.equal('isRead', false)]
        );
        return response.total;
    } catch (error) {
        console.error('Error fetching unread notification count:', error);
        return 0;
    }
};