import { Alert, StyleSheet, Image, View } from 'react-native'
import React, { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../context/LocalizationContext';
import { SPACING } from '../theme';
import Button from './Button';
import Typography from './Typography';

type ImageSelectorProps = {
  onImageSelected: (uri: string) => void;
  imageUrl?: string
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelected, imageUrl }) => {
  const { translate } = useLanguage();

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(translate('permission_denied_camera'));
      }
    };
    checkPermissions();
  }, []);

  const selectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(translate('permission_denied_Photo'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 2],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        onImageSelected(result.assets[0].uri);
      } else {
        Alert.alert(translate('image_selection_canceled'));
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert(translate('image_selection_failed'));
    }
  };

  return (
    <View style={styles.imageContainer}>
      <Button variant="secondary" onPress={selectImage}>
        {translate('pick_image')}
      </Button>
      <View style={styles.imageStyling}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Typography variant="title04">{translate('no_image_selected')}</Typography>
        )}
      </View>
    </View>
  )
}

export default ImageSelector

const styles = StyleSheet.create({
  imageContainer: {
    padding: SPACING.spacing02,
  },
  imageStyling: {
    alignItems: 'center',
    padding: SPACING.spacing01,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: SPACING.spacing01,
  },
});