import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Share, RefreshControl } from 'react-native';
import Typography from '../../../components/Typography';
import { StyleProps, useTheme } from '../../../context/ThemeProvider';
import { SPACING } from '../../../theme';
import { deleteOrganization, listOrganization, organizationData } from '../../../appwriteDB/organizationInfo_db';
import UserDatabaseService from '../../../appwriteDB/user_db';
import Input from '../../../components/TextInput';
import Button from '../../../components/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useUserOrg } from '../../../context/userOrgContext';
import { ScrollView } from 'react-native-gesture-handler';

const OrganizationInfo = () => {
    const initialOrganizationDetails = useMemo(() => ({
        $id: '',
        userId: '',
        name: '',
        details: '',
    }), []);

    const [organizationDetails, setOrganizationDetails] = useState<organizationData>(initialOrganizationDetails);
    const [showOrganization, setShowOrganization] = useState<boolean>(false);
    const [orgId, setOrgId] = useState<string>('');
    const { colors } = useTheme();
    const styles = getStyles({ colors });
    const userDatabaseService = new UserDatabaseService();
    const navigation = useNavigation();
    const { userId, organizationId, refreshOrganizationInfo, loading } = useUserOrg();
    const [showButton, setShowButton] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshOrganizationInfo();
        setRefreshing(false);
    };

    const getStoredOrganization = async () => {
        try {
            const storedOrg = await AsyncStorage.getItem('organizationDetails');
            if (storedOrg) {
                setOrganizationDetails(JSON.parse(storedOrg));
                setShowOrganization(true);
            }
        } catch (error) {
            console.error('Error loading stored organization info:', error);
        }
    };

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

    useEffect(() => {
        const fetchOrganizationInfo = async () => {
            try {
                if (organizationId) {
                    const response = await listOrganization(organizationId);
                    if (response && response.$id) {
                        setOrganizationDetails(response);
                        setShowOrganization(true);
                        saveOrganizationToStorage(response);
                    } else {
                        clearOrganizationFromStorage();
                        setOrganizationDetails(initialOrganizationDetails);
                        setShowOrganization(false);
                        Alert.alert('No Data', 'No organization info available. Kindly contact your organizer.');
                    }
                } else {
                    clearOrganizationFromStorage();
                    setOrganizationDetails(initialOrganizationDetails);
                    setShowOrganization(false);
                    Alert.alert('No Organization', 'No organization ID found. Kindly add your organization ID.');
                }
            } catch (error) {
                console.error('Error fetching organization info:', error);
                Alert.alert('Error to loading Organization', 'Your organizer delete organization, kindly contact your organizer.');
            }
        };

        getStoredOrganization();
        fetchOrganizationInfo();
    }, [organizationId]);

    useEffect(() => {
        if (userId === organizationDetails.userId) {
            setShowButton(true);
        }
    }, [userId, organizationDetails]);

    const handleSubmit = async () => {
        try {
            await userDatabaseService.updateUserOrganizationId(userId, orgId);
            const response = await listOrganization(orgId);

            if (response && response.$id) {
                setOrganizationDetails(response);
                setShowOrganization(true);
                saveOrganizationToStorage(response);
            } else {
                clearOrganizationFromStorage();
                setShowOrganization(false);
                Alert.alert('No Data', 'No organization data found. Kindly add your organization Id.');
            }
        } catch (error) {
            console.error('Error updating organization ID:', error);
            Alert.alert('Error', 'Failed to update organization ID.');
        }
    };

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Organization ID: ${organizationDetails.$id}`,
            });
            if (result.action === Share.sharedAction) {
                console.log(result.activityType ? 'Shared with activity type' : 'Shared successfully');
            } else {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'There was an error trying to share the organization details.');
        }
    };

    const handleDelete = async () => {
        try {
            if (userId === organizationDetails.userId) {
                await deleteOrganization(organizationId);
            }
            await userDatabaseService.updateUserOrganizationId(userId, '');
            setOrganizationDetails({
                $id: '',
                userId: '',
                name: '',
                details: '',
            });
            setShowOrganization(false);
            await clearOrganizationFromStorage();

            Alert.alert('Success', 'Organization deleted successfully.');
        } catch (error) {
            console.log('Error occurred while deleting organization:', error);
            Alert.alert('Error', 'Failed to delete the organization. Please try again.');
        }
    };


    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.container}>
                {showOrganization ? (
                    <View style={styles.infoContainer}>
                        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                            <View>
                                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Organization ID:</Typography>
                                <Typography variant="title03">{organizationDetails.$id}</Typography>
                            </View>
                            <TouchableOpacity onPress={handleShare}>
                                <AntDesign name="sharealt" size={24} color={colors.icon} style={{ paddingHorizontal: SPACING.spacing03 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.card}>
                            <Typography variant={"title03"} style={{ fontWeight: '700' }}>Organization Name:</Typography>
                            <Typography variant="title03">{organizationDetails.name}</Typography>
                        </View>
                        <View style={styles.card}>
                            <Typography variant={"title03"} style={{ fontWeight: '700' }}>Organization Details:</Typography>
                            <Typography variant="title04">{organizationDetails.details}</Typography>
                        </View>

                        <View style={{ gap: SPACING.spacing02, paddingVertical: SPACING.spacing03 }}>
                            {showButton && (
                                <Button variant='button01' onPress={() => navigation.navigate('UpdateOrganization' as never)}>
                                    Update
                                </Button>
                            )}
                            <Button variant='button03' onPress={() => handleDelete()}>Delete</Button>
                        </View>
                    </View>
                ) : (
                    <View style={styles.OrgInputStyle}>
                        <Input
                            label="Organization ID"
                            placeholder="Enter your organization ID"
                            value={orgId}
                            onChangeText={setOrgId}
                        />
                        <Button onPress={handleSubmit}>Submit</Button>
                        <Typography variant={'title01'} style={{ alignSelf: 'center' }}> OR </Typography>
                        <Button variant='secondary' onPress={() => navigation.navigate('CreateOrganization' as never)}>Create Organization</Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default OrganizationInfo;

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.spacing03,
        backgroundColor: colors.background,
    },
    card: {
        backgroundColor: colors.card,
        borderRadius: 8,
        padding: SPACING.spacing02,
        marginVertical: SPACING.spacing01,
        shadowColor: colors.gray100,
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    infoContainer: {
        gap: SPACING.spacing01,
    },
    OrgInputStyle: {
        gap: SPACING.spacing03
    }
});
