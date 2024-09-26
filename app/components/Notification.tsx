import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAllNotification, EditNotification, DeleteNotification } from '../appwriteDB/sendPushNotification';
import { account } from '../appwrite/appWriteConfig';
import { mapDocumentsToNotifications } from '../utils/notificationMapper';
import { Notification } from '../utils/notificationMapper';
import Entypo from '@expo/vector-icons/Entypo';
import { SPACING } from '../theme';
import showAlert from './Alert';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import Typography from './Typography';

const NotificationList = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
    const { colors } = useTheme()
    const styles = getStyles({ colors })

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
                    <Typography style={{ fontWeight: '700' }} variant={'title04'}>{item.title}</Typography>
                    <Typography variant='body01' numberOfLines={isExpanded ? undefined : 1}>
                        {item.message}
                    </Typography>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.$id)} style={styles.closeIcon}>
                    <Entypo name="circle-with-cross" size={24} color={colors.icon} />
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

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
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
        backgroundColor: colors.gray100,
    },
    readNotification: {
        backgroundColor: colors.card,
    },

    closeIcon: {
        position: 'absolute',
        top: SPACING.spacing02,
        right: SPACING.spacing02,
    },
});

export default NotificationList;
