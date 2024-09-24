import { Alert, StyleSheet, ScrollView, View } from 'react-native';
import React, { useReducer } from 'react';
import { initialState, reducer } from '../../utils/reducer';
import Input from '../../components/TextInput';
import { resetState, setField } from '../../components/action';
import { useLanguage } from '../../context/LocalizationContext';
import { account, APPWRITE_ENDPOINT, APPWRITE_POST_ASSETS_BUCKET_ID, APPWRITE_PROJECT_ID } from '../../appwrite/appWriteConfig';
import { SPACING } from '../../theme';
import Button from '../../components/Button';
import { uploadPostFile } from '../../appwriteDB/storage';
import { createPost } from '../../appwriteDB/post_db';
import FileSelector from '../FileSelector';
import Loading from '../../components/Loading';
import { createPostAssets } from '../../appwriteDB/postAssets';
import { getOrganizationId } from '../../appwriteDB/organizationInfo_db';

const PostCreation = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { translate } = useLanguage();

  const handleFilePick = async (uri: string, name: string) => {
    if (state.isUploading) return;
    dispatch(setField({ isUploading: true }));

    try {
      const data = await uploadPostFile(uri, name);
      const fileId = data.$id;
      const fileUrl = `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_POST_ASSETS_BUCKET_ID}/files/${fileId}/view?project=${APPWRITE_PROJECT_ID}`;

      const assets = {
        name: data.name,
        fileUrl,
      };
      const postAsset = await createPostAssets(assets);
      const postAssetId = postAsset.$id;

      dispatch(setField({
        postAssets: [...state.postAssets, postAssetId]
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      Alert.alert(translate('image_upload_failed'));
    } finally {
      dispatch(setField({ isUploading: false }));
    }
  };

  const handleSubmit = async () => {
    if (state.isUploading) return;
    dispatch(setField({ isUploading: true }));

    try {
      const user = await account.get();
      const userId = user.$id;
      const organizationId = await getOrganizationId()

      const post = {
        userId,
        title: state.title,
        details: state.details,
        timestamp: new Date().toISOString(),
        isApproved: false,
        isDisApproved: false,
        postAssets: state.postAssets,
        organizationId
      };

      const response = await createPost(post);
      if (response) {
        Alert.alert(translate('post_created_successfully'));
        dispatch(resetState());
      } else {
        Alert.alert(translate('post_create_error'));
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(translate(`post_create_error: ${(error as Error).message}`));
    } finally {
      dispatch(setField({ isUploading: false }));
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Input
          label={translate('Title')}
          placeholder={translate('enter_title')}
          value={state.title}
          onChangeText={(text: any) => dispatch(setField({ title: text }))}
        />
        <Input
          label={translate('Details')}
          placeholder={translate('enter_details')}
          value={state.details}
          onChangeText={(text: any) => dispatch(setField({ details: text }))}
        />
        <View style={styles.imageContainer}>
          <FileSelector onFileSelected={handleFilePick} />
          <Button variant="primary" onPress={handleSubmit}>
            {translate('submit')}
          </Button>
        </View>
      </ScrollView>
      {state.isUploading && <Loading />}
    </View>
  );
};

export default PostCreation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    padding: SPACING.spacing02,
  },
});
