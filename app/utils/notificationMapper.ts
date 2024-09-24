import { Models } from 'appwrite';

export type Notification = {
    $id: string;
    title: string;
    message: string;
    isRead: boolean;
    userId: string;
    timeStamp: string
}

export const mapDocumentsToNotifications = (documents: Models.Document[]): Notification[] => {
    return documents.map((document) => ({
        $id: document.$id,
        title: document.title,
        message: document.message,
        isRead: document.isRead,
        userId: document.userId,
        timeStamp: document.timeStamp,
    }));
};
