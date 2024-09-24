import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { RADIUS, SPACING } from '../theme';

type File = {
  fileUrl: string;
  name: string;
};

type FileViewerProps = {
  fileUrls: File[];
};

const FileViewer: React.FC<FileViewerProps> = ({ fileUrls }) => {

  const getFileType = (name: string) => {
    if (name.includes('pdf')) return 'pdf';
    if (name.includes('doc') || name.includes('docx')) return 'doc';
    if (name.includes('jpg') || name.includes('jpeg') || name.includes('png') || name.includes('gif')) return 'image';
    return 'unknown';
  };

  const getThumbnail = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return require('../assets/Images/pdf.png');
      case 'doc':
        return require('../assets/Images/docs.png');
      case 'image':
        return null;
      default:
        return require('../assets/Images/file.png');
    }
  };

  return (
    <View style={styles.container}>
      {fileUrls.length > 0 ? (
        fileUrls.map((file, index) => {
          const { fileUrl, name } = file;

          if (typeof fileUrl !== 'string') {
            console.warn(`Invalid URL at index ${index}: ${fileUrl}`);
            return null;
          }

          const fileType = getFileType(name);
          const thumbnail = getThumbnail(fileType);

          if (fileType === 'image') {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(fileUrl)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: fileUrl }} style={styles.image} />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => Linking.openURL(fileUrl)}
                style={styles.iconContainer}
              >
                {thumbnail && <Image source={thumbnail} style={styles.thumbnail} />}
                {/* <Text style={styles.fileTypeText}>{name}</Text> */}
              </TouchableOpacity>
            );
          }
        })
      ) : (
        <Text>No files available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.spacing01
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.small,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.small,
  },
  fileTypeText: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default FileViewer;
