import React, { useReducer, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { listOrganization, updateOrganization } from '../../appwriteDB/organizationInfo_db';
import { reducer, initialState } from '../../utils/reducer';
import { setField } from '../action';
import Input from '../TextInput';
import Button from '../Button';
import { useUserOrg } from '../../context/userOrgContext';
import { SPACING } from '../../theme';

const UpdateOrganization = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { userId, organizationId } = useUserOrg();

    const fetchOrganizationInfo = async () => {
        try {
            if (organizationId) {
                const response = await listOrganization(organizationId);
                if (response && response.$id) {
                    dispatch(setField({
                        name: response.name,
                        details: response.details,
                    }));
                }
            }
        } catch (error) {
            console.log('Error occurred while fetching organization details:', error);
        }
    };

    useEffect(() => {
        fetchOrganizationInfo();
    }, [organizationId]);

    const handleSubmit = async () => {
        try {
            if (!organizationId) {
                Alert.alert('No organization ID found');
                return;
            }

            const orgData = {
                userId,
                name: state.name,
                details: state.details,
            };

            const response = await updateOrganization(organizationId, orgData);
            if (response) {
                Alert.alert('Organization Details Updated Successfully.');
                console.log('Organization updated successfully');
            } else {
                Alert.alert('Error in updating organization.');
            }
        } catch (error) {
            Alert.alert(`Error: ${(error as Error).message}`);
        }
    };

    return (
        <View style={styles.container}>
            <Input
                label="Organization Name"
                placeholder='Organization Name'
                value={state.name}
                onChangeText={(text) => dispatch(setField({ name: text }))}
            />
            <Input
                label="Organization Details"
                placeholder='Organization Details'
                value={state.details}
                onChangeText={(text) => dispatch(setField({ details: text }))}
            />
            <View style={styles.buttonStyle}>
                <Button variant='secondary' onPress={handleSubmit}>Submit</Button>
            </View>
        </View>
    );
};

export default UpdateOrganization;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.spacing03,
        backgroundColor: '#fff',
        gap: SPACING.spacing02
    },
    buttonStyle: {
        marginTop: SPACING.spacing02
    }
});
