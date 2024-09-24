import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useLanguage } from '../context/LocalizationContext';
import { SPACING } from '../theme';
import Button from './Button';

type FileSelectorProps = {
  onFileSelected: (uri: string, name: string) => void;
};

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelected }) => {
  const { translate } = useLanguage();
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>();

  const selectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['*/*'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        if (file.uri && file.name) {
          setSelectedFileName(file.name);
          onFileSelected(file.uri, file.name);
        } else {
          Alert.alert(translate('file_selection_failed'));
        }
      } else {
        Alert.alert(translate('file_selection_canceled'));
      }
    } catch (error) {
      console.error('File selection error:', error);
      Alert.alert(translate('file_selection_failed'));
    }
  };

  return (
    <View style={styles.container}>
      <Button variant="secondary" onPress={selectFile}>
        {translate('pick_files')}
      </Button>
      <View style={styles.previewContainer}>
        {selectedFileName ? (
          <Text style={styles.fileName}>{selectedFileName}</Text>
        ) : (
          <Text>{translate('no_file_selected')}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.spacing02,
  },
  previewContainer: {
    alignItems: 'center',
    padding: SPACING.spacing01,
  },
  fileName: {
    marginVertical: SPACING.spacing01,
  },
});

export default FileSelector;
