import { Alert, StyleSheet, ScrollView, View } from 'react-native';
import React, { useReducer } from 'react';
import { initialState, reducer } from '../../utils/reducer';
import Input from '../../components/TextInput';
import { resetState, setField } from '../../components/action';
import { useLanguage } from '../../context/LocalizationContext';
import { account } from '../../appwrite/appWriteConfig';
import { SPACING } from '../../theme';
import Button from '../../components/Button';
import Loading from '../../components/Loading';
import { createOrganization } from '../../appwriteDB/organizationInfo_db';
import UserDatabaseService from '../../appwriteDB/user_db';

const OrganizationCreation = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { translate } = useLanguage();
    const userDatabaseService = new UserDatabaseService();

    const handleSubmit = async () => {
        if (state.isUploading) return;
        if (!state.name || !state.details) {
            Alert.alert(translate('Please fill all fields'));
            return;
        }

        dispatch(setField({ isUploading: true }));

        try {
            const user = await account.get();
            const userId = user.$id;

            const organizationInfo = {
                userId,
                name: state.name, 
                details: state.details,
            };

            const response = await createOrganization(organizationInfo);
            if (response) {
                console.log('response:', response)
                const organizationId = response.$id
                await userDatabaseService.updateUserOrganizationId(userId, organizationId);
                Alert.alert(translate('Organization created successfully'));
                dispatch(resetState());
            } else {
                Alert.alert(translate('Error creating organization'));
            }
        } catch (error) {
            console.error('Error creating organization:', error);
            Alert.alert(translate('Error creating organization: ') + (error as Error).message);
        } finally {
            dispatch(setField({ isUploading: false }));
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Input
                    label={translate('Organization Name')}
                    placeholder={translate('Enter Your Organization name')}
                    value={state.name}
                    onChangeText={(text: any) => dispatch(setField({ name: text }))}
                />
                <Input
                    label={translate('Organization Details')}
                    placeholder={translate('Enter Your Organization details')}
                    value={state.details}
                    onChangeText={(text: any) => dispatch(setField({ details: text }))}
                />
                <View style={styles.buttonContainer}>
                    <Button variant="primary" onPress={handleSubmit}>
                        {translate('Submit')}
                    </Button>
                </View>
            </ScrollView>
            {state.isUploading && <Loading />}
        </View>
    );
};

export default OrganizationCreation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.spacing02,
    },
    scrollView: {
        flex: 1,
    },
    buttonContainer: {
        padding: SPACING.spacing02,
    },
});
