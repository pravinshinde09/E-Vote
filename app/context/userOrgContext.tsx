import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { account } from '../appwrite/appWriteConfig';
import UserDatabaseService from '../appwriteDB/user_db';

type ContextType = {
    userId: string;
    organizationId: string;
    loading: boolean;
    refreshOrganizationInfo: () => Promise<void>;
};

const UserOrgContext = createContext<ContextType | undefined>(undefined);

export const useUserOrg = () => {
    const context = useContext(UserOrgContext);
    if (!context) {
        throw new Error('useUserOrg must be used within a UserOrgProvider');
    }
    return context;
};

const UserOrgProvider = ({ children }: { children: React.ReactNode }) => {
    const [userId, setUserId] = useState<string>('');
    const [organizationId, setOrganizationId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const fetchOrganizationId = async () => {
        const userDatabaseService = new UserDatabaseService();
        setLoading(true);
        try {
            const user = await account.get();
            if (user) {
                setUserId(user.$id);
                const userProfile = await userDatabaseService.getUserProfile(user.$id);
                if (userProfile?.organizationId) {
                    setOrganizationId(userProfile.organizationId);
                    return userProfile.organizationId;
                } else {
                    console.log('Organization ID not found.');
                    return null;
                }
            } else {
                console.log('User not authenticated.');
                return null;
            }
        } catch (error) {
            console.log('Error fetching organizationId:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshOrganizationInfo = async () => {
        setLoading(true);
        await fetchOrganizationId();
        setLoading(false);
    };

    useEffect(() => {
        fetchOrganizationId();
    }, []);

    const contextValues = useMemo(() => ({
        userId,
        organizationId,
        loading,
        refreshOrganizationInfo,
    }), [userId, organizationId, loading]); 

    return (
        <UserOrgContext.Provider value={contextValues}>
            {children}
        </UserOrgContext.Provider>
    );
};

export default UserOrgProvider;
