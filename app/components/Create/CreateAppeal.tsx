import { Alert, StyleSheet, View } from 'react-native';
import React, { useEffect, useReducer } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { CreatePostStackParamList } from '../../navigation/CreatePostScreenNavigation';
import { reducer, initialState } from '../../utils/reducer';
import { createPost, getPost } from '../../appwriteDB/post_db';
import { setField } from '../action';
import { useLanguage } from '../../context/LocalizationContext';
import { uploadPostFile } from '../../appwriteDB/storage';
import { account, APPWRITE_ENDPOINT, APPWRITE_POST_ASSETS_BUCKET_ID, APPWRITE_PROJECT_ID } from '../../appwrite/appWriteConfig';
import Input from '../TextInput';
import { SPACING } from '../../theme';
import Button from '../Button';
import Loading from '../Loading';
import FileSelector from '../FileSelector';
import { createPostAssets } from '../../appwriteDB/postAssets';

type CreateAppealRouteProp = RouteProp<CreatePostStackParamList, 'CreateAppeal'>;

const CreateAppeal = () => {
    const route = useRoute<CreateAppealRouteProp>();
    const postId = route.params.postId;
    const { translate } = useLanguage();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const post = await getPost(postId);
                dispatch(setField({
                    title: post.title,
                    details: post.details,
                }));
            } catch (error) {
                Alert.alert(`Error fetching post: ${(error as Error).message}`);
            }
        };
        fetchPostData();
    }, [postId]);


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

            const post = {
                userId,
                title: state.title,
                details: state.details,
                timestamp: new Date().toISOString(),
                isApproved: false,
                postAssets: state.postAssets,
                referencePostId: postId
            };

            const response = await createPost(post);
            if (response) {
                Alert.alert(translate('Appeal_Create_successfully'));
                console.log('Appeal create successfully');
            } else {
                Alert.alert(translate('Appeal_Create_error'));
            }
        } catch (error) {
            Alert.alert(translate(`Appeal_Create_error: ${(error as Error).message}`));
        } finally {
            dispatch(setField({ isUploading: false }));
        }
    };

    return (
        <View style={styles.container}>
            <Input
                label="Title"
                placeholder='Post Title'
                value={state.title}
                onChangeText={(text) => dispatch(setField({ title: text }))}
            />
            <Input
                label="Details"
                placeholder='Post Details'
                value={state.details}
                onChangeText={(text) => dispatch(setField({ details: text }))}
            />
            <View style={styles.imageContainer}>
                <FileSelector onFileSelected={handleFilePick} />
                <Button variant='primary' onPress={handleSubmit}>Submit</Button>
            </View>
            {state.isUploading && <Loading />}
        </View>
    );
};

export default CreateAppeal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.spacing03,
    },
    imageContainer: {
        padding: SPACING.spacing02,
    },
});
