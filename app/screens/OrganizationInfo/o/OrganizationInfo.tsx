import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Share, RefreshControl, ScrollView } from 'react-native';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import Typography from '../../../components/Typography';
import { StyleProps, useTheme } from '../../../context/ThemeProvider';
import { SPACING } from '../../../theme';
import {
    deleteOrganization,
    listOrganization,
    organizationData
} from '../../../appwriteDB/organizationInfo_db';
import UserDatabaseService from '../../../appwriteDB/user_db';
import Input from '../../../components/TextInput';
import Button from '../../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserOrg } from '../../../context/userOrgContext';
import { HomeStackParamList } from '../../../navigation/HomeScreenNavigation';

const OrganizationInfo = () => {
    const [organizationDetails, setOrganizationDetails] = useState<organizationData | null>(null);
    const [orgId, setOrgId] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);

    const { colors } = useTheme();
    const styles = getStyles({ colors });
    const userDatabaseService = new UserDatabaseService();
    const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
    const { userId, organizationId, refreshOrganizationInfo, loading } = useUserOrg();

    // Fetch organization info
    const fetchOrganizationInfo = async () => {
        try {
            if (!organizationId) {
                clearOrganizationFromStorage();
                setOrganizationDetails(null);
                Alert.alert('No Organization', 'No organization ID found. Kindly add your organization ID.');
                return;
            }
            const response = await listOrganization(organizationId);
            if (response?.$id) {
                setOrganizationDetails(response);
                saveOrganizationToStorage(response);
            } else {
                handleNoOrganization();
            }
        } catch (error) {
            console.error('Error fetching organization info:', error);
            Alert.alert('Error', 'Failed to fetch organization details. Please try again.');
        }
    };

    // Helpers for AsyncStorage
    const saveOrganizationToStorage = async (orgData: organizationData) => {
        try {
            await AsyncStorage.setItem('organizationDetails', JSON.stringify(orgData));
        } catch (error) {
            console.error('Error saving organization info:', error);
        }
    };

    const clearOrganizationFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('organizationDetails');
        } catch (error) {
            console.error('Error clearing organization info:', error);
        }
    };

    const handleNoOrganization = () => {
        clearOrganizationFromStorage();
        setOrganizationDetails(null);
        Alert.alert('No Data', 'No organization info available. Kindly contact your organizer.');
    };

    const handleSubmit = async () => {
        try {
            await userDatabaseService.updateUserOrganizationId(userId, orgId);
            const response = await listOrganization(orgId);
            if (response?.$id) {
                setOrganizationDetails(response);
                saveOrganizationToStorage(response);
            } else {
                handleNoOrganization();
            }
        } catch (error) {
            console.error('Error updating organization ID:', error);
            Alert.alert('Error', 'Failed to update organization ID.');
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({ message: `Organization ID: ${organizationDetails?.$id}` });
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'Failed to share organization details.');
        }
    };

    const handleDelete = async () => {
        try {
            if (userId === organizationDetails?.userId) {
                await deleteOrganization(organizationId);
            }
            await userDatabaseService.updateUserOrganizationId(userId, '');
            setOrganizationDetails(null);
            clearOrganizationFromStorage();
            Alert.alert('Success', 'Organization deleted successfully.');
        } catch (error) {
            console.error('Error deleting organization:', error);
            Alert.alert('Error', 'Failed to delete the organization.');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshOrganizationInfo();
        await fetchOrganizationInfo();
        setRefreshing(false);
    };

    useEffect(() => {
        if (organizationId) fetchOrganizationInfo();
    }, [organizationId]);

    useFocusEffect(
        React.useCallback(() => {
            if (!organizationDetails) refreshOrganizationInfo();
        }, [organizationDetails])
    );

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <View style={styles.container}>
                {organizationDetails ? (
                    <View style={styles.infoContainer}>
                        <View style={[styles.card, styles.row]}>
                            <View>
                                <Typography variant="title03" style={styles.boldText}>Organization ID:</Typography>
                                <Typography variant="title03">{organizationDetails.$id}</Typography>
                            </View>
                            <TouchableOpacity onPress={handleShare}>
                                <AntDesign name="sharealt" size={24} color={colors.icon} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <Typography variant="title03" style={styles.boldText}>Organization Name:</Typography>
                            <Typography variant="title03">{organizationDetails.name}</Typography>
                        </View>
                        <View style={styles.card}>
                            <Typography variant="title03" style={styles.boldText}>Organization Details:</Typography>
                            <Typography variant="title04">{organizationDetails.details}</Typography>
                        </View>
                        <View style={styles.buttonContainer}>
                            {userId === organizationDetails.userId && (
                                <Button onPress={() => navigation.navigate('UpdateOrganization')}>Update</Button>
                            )}
                            <Button variant="button03" onPress={handleDelete}>Delete</Button>
                        </View>
                    </View>
                ) : (
                    <View style={styles.inputContainer}>
                        <Input
                            label="Organization ID"
                            placeholder="Enter your organization ID"
                            value={orgId}
                            onChangeText={setOrgId}
                        />
                        <Button onPress={handleSubmit}>Submit</Button>
                        <Typography variant="title01" style={styles.centerText}>OR</Typography>
                        <Button variant="secondary" onPress={() => navigation.navigate('CreateOrganization')}>Create Organization</Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default OrganizationInfo;

const getStyles = ({ colors }: StyleProps) =>
    StyleSheet.create({
        container: { flex: 1, padding: SPACING.spacing03, backgroundColor: colors.background },
        card: { backgroundColor: colors.card, borderRadius: 8, padding: SPACING.spacing02, marginVertical: SPACING.spacing01 },
        boldText: { fontWeight: '700' },
        infoContainer: { gap: SPACING.spacing02 },
        buttonContainer: { marginTop: SPACING.spacing03, gap: SPACING.spacing02 },
        inputContainer: { gap: SPACING.spacing03 },
        row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
        centerText: { alignSelf: 'center' },
    });
