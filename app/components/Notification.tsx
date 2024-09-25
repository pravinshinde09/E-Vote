import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAllNotification, EditNotification, DeleteNotification } from '../appwriteDB/sendPushNotification';
import { account } from '../appwrite/appWriteConfig';
import { mapDocumentsToNotifications } from '../utils/notificationMapper';
import { Notification } from '../utils/notificationMapper';
import Entypo from '@expo/vector-icons/Entypo';
import { SPACING } from '../theme';
import showAlert from './Alert';

const NotificationList = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchAllNotifications = async () => {
            try {
                const user = await account.get();
                const userId = user.$id;

                const response = await getAllNotification(userId);

                if (response && response.documents) {
                    const documents = response.documents;
                    const formattedNotifications = mapDocumentsToNotifications(documents);

                    // Sort by timestamp
                    formattedNotifications.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());

                    setNotifications(formattedNotifications);
                } else {
                    console.log('No notifications found or response is undefined.');
                    setNotifications([]);
                }
            } catch (error) {
                console.log('Error fetching user notifications:', error);
            }
        };

        fetchAllNotifications();
    }, []);

    // Handle card press
    const handleCardPress = async (notification: Notification) => {
        setExpandedNotifications((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(notification.$id)) {
                newSet.delete(notification.$id);
            } else {
                newSet.add(notification.$id);
            }
            return newSet;
        });

        if (!notification.isRead) {
            const updatedNotifications = notifications.map((notif) =>
                notif.$id === notification.$id ? { ...notif, isRead: true } : notif
            );
            setNotifications(updatedNotifications);

            try {
                await EditNotification(notification.$id, true);
            } catch (error) {
                console.log('Error updating notification status:', error);
            }
        }
    };

    const handleDelete = async (notificationId: string) => {
        showAlert({
            title: "Delete Notification",
            message: "Are you sure you want to delete this notification?",
            onConfirm: async () => {
                try {
                    await DeleteNotification(notificationId);
                    setNotifications((prev) => prev.filter((notif) => notif.$id !== notificationId));
                } catch (error) {
                    console.log('Error occurred while deleting notification:', error);
                    Alert.alert("Error", "Failed to delete notification.");
                }
            },
            confirmText: "Delete"
        });
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const isExpanded = expandedNotifications.has(item.$id);
        return (
            <View style={[styles.notificationItem, item.isRead ? styles.readNotification : styles.unreadNotification]}>
                <TouchableOpacity onPress={() => handleCardPress(item)}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.message} numberOfLines={isExpanded ? undefined : 1}>
                        {item.message}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.$id)} style={styles.closeIcon}>
                    <Entypo name="circle-with-cross" size={24} color="black" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.$id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    notificationItem: {
        padding: SPACING.spacing03,
        marginBottom: SPACING.spacing03,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        position: 'relative', 
    },
    unreadNotification: {
        backgroundColor: '#d3d3d3',
    },
    readNotification: {
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        fontSize: 14,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});

export default NotificationList;
