import { Alert, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { initialState, reducer } from '../../utils/reducer';
import UserDatabaseService from '../../appwriteDB/user_db';
import { resetState, setField } from '../action';
import { APPWRITE_AVATAR_BUCKETS_ID, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from '../../appwrite/appWriteConfig';
import { useLanguage } from '../../context/LocalizationContext';
import { deleteAvatarImage, uploadAvatarImage } from '../../appwriteDB/storage';
import Input from '../TextInput';
import { SPACING } from '../../theme';
import Button from '../Button';
import ImageSelector from '../ImageSelector';
import Loading from '../Loading';
import { useAuthContext } from '../../appwrite/AppwriteContext';

const CreateProfile = ({ onProfileCreated }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [userId, setUserId] = useState<string | undefined>();
  const userDatabaseService = new UserDatabaseService();
  const { appwrite } = useAuthContext();
  const { translate } = useLanguage();

  const fetchUserProfile = async () => {
    try {
      const user = await appwrite.getCurrentUser() && await userDatabaseService.checkSession();

      const userId = user?.$id;
      setUserId(userId);
      if (userId) {
        const userProfile = await userDatabaseService.getUserProfile(userId);
        if (!userProfile) {
          Alert.alert(translate('user_not_found'));
          return;
        }
        dispatch(setField({
          name: userProfile.name,
          email: userProfile.email,
          phoneNumber: userProfile.phoneNumber,
          imageUrl: userProfile.avatar,
          imageId: userProfile.imageId,
          bio: userProfile.bio,
          organizationId: userProfile.organizationId
        }));
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImagePick = async (pickerResult: string) => {
    if (state.isUploading) return;
    dispatch(setField({ isUploading: true }));

    try {
      if (state.imageId) {
        try {
          await deleteAvatarImage(state.imageId);
          console.log('Old image deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting old image:', deleteError);
          Alert.alert(translate('error_old_img_delete'));
        }
      }

      const data = await uploadAvatarImage(pickerResult);
      dispatch(setField({
        imageId: data.$id,
        imageUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_AVATAR_BUCKETS_ID}/files/${data.$id}/view?project=${APPWRITE_PROJECT_ID}`,
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert(translate('image_upload_failed'));
    } finally {
      dispatch(setField({ isUploading: false }));
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        userId,
        name: state.name,
        email: state.email,
        phoneNumber: state.phoneNumber,
        imageUrl: state.imageUrl,
        imageId: state.imageId,
        bio: state.bio,
        organizationId: state.organizationId
      };

      await userDatabaseService.editUserProfile(userId!, userData);
      Alert.alert(translate('profile_Create_successfully'));
      dispatch(resetState());
      if (onProfileCreated) {
        onProfileCreated();
      }
      console.log('Profile updated successfully');
    } catch (error) {
      Alert.alert(translate(`profile_update_error: ${(error as Error).message}`));
    }
  };

  return (
    <View style={styles.container}>
      <Text>{translate('CreateProfile')}</Text>
      <Input
        label={translate('Name')}
        placeholder={translate('Enter your name')}
        value={state.name}
        onChangeText={(text) => dispatch(setField({ name: text }))}
      />
      <Input
        label={translate('Email')}
        placeholder={translate('Enter your email')}
        value={state.email}
        onChangeText={(text) => dispatch(setField({ email: text }))}
      />
      <Input
        label={translate('Phone Number')}
        placeholder={translate('Enter your phone number')}
        value={state.phoneNumber}
        onChangeText={(text) => dispatch(setField({ phoneNumber: text }))}
      />
      <Input
        label={translate('Bio Info')}
        placeholder={translate('Enter your Bio information')}
        value={state.bio}
        onChangeText={(text) => dispatch(setField({ bio: text }))}
      />
      <Input
        label={translate('Organization Id (optional)')}
        placeholder={translate('Enter your Organization Id')}
        value={state.organizationId}
        onChangeText={(text) => dispatch(setField({ organizationId: text }))}
      />
      <View style={styles.imageContainer}>
        <ImageSelector onImageSelected={handleImagePick} imageUrl={state.imageUrl} />
        <Button variant='secondary' onPress={handleSubmit}>Submit</Button>
      </View>
      {state.isUploading && <Loading />}
    </View>
  );
};

export default CreateProfile;

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20
  },
  imageContainer: {
    padding: SPACING.spacing02,
  }
});
