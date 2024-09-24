import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { PostData } from '../types/type';
import { UserData } from './Profile/Type';
import moment from 'moment';
import { RADIUS, SPACING } from '../theme';
import Typography from './Typography';
import Button from './Button';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Profile from '../assets/svg/Profile';
import { RootStackParamList } from '../navigation/TabNavigation';
import { StyleProps, useTheme } from '../context/ThemeProvider';
import ReferencePostCard from './ReferencePostCard';
import FileViewer from './FileViewer';
import usePostAssets from '../hooks/usePostAssets';

type Props = {
  postData: PostData;
  userProfile: UserData | null;
};

const Card = ({ postData, userProfile }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = getStyles({ colors });

  const timeAgo = (timestamp: string): string => {
    return moment(timestamp).fromNow();
  };

  const { assets } = usePostAssets(postData.postAssets || []);

  return (
    <View style={styles.postContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          {userProfile?.imageUrl ? (
            <Image
              source={{ uri: userProfile.imageUrl }}
              style={styles.userImage}
            />
          ) : (
            <Profile width={40} height={40} color={'black'} />
          )}
          <View>
            <Typography variant="title03" style={styles.username}>
              {userProfile?.name || 'Anonymous'}
            </Typography>
            <Typography variant="body01">
              {timeAgo(postData.timestamp)}
            </Typography>
          </View>
        </View>
      </View>
      <View style={{ gap: SPACING.spacing02 }}>
        <Typography variant="title03" style={{ fontWeight: '700' }}>
          {postData.title}
        </Typography>
        <Typography variant="title04">{postData.details}</Typography>
        {postData.referencePostId && (
          <View style={{ padding: SPACING.spacing02 }}>
            <ReferencePostCard referencePostId={postData.referencePostId} />
          </View>
        )}
        {assets && assets.length > 0 && <FileViewer fileUrls={assets} />}
      </View>
      <View style={styles.actionsContainer}>
        <Button
          onPress={() => {
            navigation.navigate('PostCreation', {
              screen: 'CreateAppeal',
              params: { postId: postData.$id || '' },
            });
          }}
        >
          Appeal
        </Button>
      </View>
    </View>
  );
};

export default Card;

const getStyles = ({ colors }: StyleProps) =>
  StyleSheet.create({
    postContainer: {
      marginBottom: SPACING.spacing03,
      padding: SPACING.spacing03,
      backgroundColor: colors.card,
      borderRadius: RADIUS.small,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    userInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.spacing02,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userImage: {
      width: 40,
      height: 40,
      marginRight: SPACING.spacing02,
      borderRadius: RADIUS.full,
    },
    username: {
      fontWeight: 'bold',
    },
    actionsContainer: {
      marginTop: SPACING.spacing01,
    },
  });
