import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Typography from '../Typography';
import { RADIUS, SPACING } from '../../theme';
import ReferencePostCard from '../ReferencePostCard';
import Button from '../Button';
import { UserData } from '../Profile/Type';
import moment from 'moment';
import { StyleProps, useTheme } from '../../context/ThemeProvider';
import { PostData } from '../../types/type';
import Profile from '../../assets/svg/Profile';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import PieChart from '../PieChart';
import FileViewer from '../FileViewer';
import usePostAssets from '../../hooks/usePostAssets';
import { sendNotification } from '../../appwriteDB/sendPushNotification';

type PostCardProps = {
    post: PostData;
    userProfile: UserData | null;
    handleLike: (postId: string) => void;
    handleDislike: (postId: string) => void;
    handleNeutral: (postId: string) => void;
    totalUser: number;
};

const PostCard: React.FC<PostCardProps> = ({ post, userProfile, handleLike, handleDislike, handleNeutral, totalUser }) => {
    const { colors } = useTheme();
    const styles = getStyles({ colors });
    const [disable, setDisable] = useState(false);

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = ['20%', '80%'];

    const { assets } = usePostAssets(post.postAssets || []);

    function handlePressModal() {
        bottomSheetModalRef.current?.present();
    }

    const handleDismissModal = () => {
        bottomSheetModalRef.current?.dismiss();
    };

    useEffect(() => {
        const postDate = moment(post.timestamp);
        const currentDate = moment();
        const durationHours = currentDate.diff(postDate, 'hours');

        // Notify 8 hours before the 3-day mark
        if (durationHours >= (3 * 24) - 8 && durationHours < (3 * 24) - 4) {
            const title = '🚨 Voting Deadline Approaching!';
            const message = `Only 8 hours left to vote on "${post.title}". Make your voice heard!`;
            sendNotification({ title, message });
        }

        // Notify 4 hours before the 3-day mark
        if (durationHours >= (3 * 24) - 4 && durationHours < (3 * 24)) {
            const title = '⏰ Last Chance to Vote!';
            const message = `Final 4 hours to vote on "${post.title}". Don't miss out!`;
            sendNotification({ title, message });
        }

        // Disable voting after 3 days
        if (durationHours >= 3 * 24) {
            setDisable(true);
            const title = '🛑 Voting Period Closed';
            const message = `Voting for "${post.title}" has ended. Thank you for your participation!`;
            sendNotification({ title, message });
        }
    }, [post.timestamp]);
    const timeAgo = (timestamp: string): string => moment(timestamp).fromNow();

    const totalCount = (post.like?.length || 0) + (post.disLike?.length || 0) + (post.neutral?.length || 0);
    const pendingUser = totalUser - totalCount;

    const getWidthPercentage = (count: number) => {
        if (totalCount === 0) return 0;
        return (count / totalCount) * 100;
    };

    const data = [
        { value: totalUser, color: '#374785' },
        { value: totalCount, color: '#A5D768' },
        { value: pendingUser, color: '#F76C6C' }
    ];

    return (
        <View style={styles.container}>
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
                            <Typography variant="title03" style={styles.username}>{userProfile?.name || "Anonymous"}</Typography>
                            <Typography variant="body01">{timeAgo(post.timestamp)}</Typography>
                        </View>
                    </View>
                    <Button variant="link" onPress={handlePressModal}><Typography variant='title03' style={{ fontWeight: '700' }}>⋮</Typography></Button>
                </View>
                <View style={{ gap: SPACING.spacing02 }}>
                    <Typography variant="title03" style={{ fontWeight: '700' }}>{post.title}</Typography>
                    <Typography variant="title04">{post.details}</Typography>

                    {post.referencePostId &&
                        <View style={{ padding: SPACING.spacing02 }}>
                            <ReferencePostCard referencePostId={post.referencePostId} />
                        </View>
                    }

                    {assets.length > 0 && <FileViewer fileUrls={assets} />}

                </View>
                {!disable && (
                    <View style={styles.actionsContainer}>
                        <Button onPress={() => handleLike(post.$id)} variant="button01" >AGREE</Button>
                        <Button onPress={() => handleNeutral(post.$id)} variant="button02" >NEUTRAL</Button>
                        <Button onPress={() => handleDislike(post.$id)} variant="button03" >DISAGREE</Button>
                    </View>
                )}
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}
                    backdropComponent={props => <BottomSheetBackdrop {...props} />}
                    onDismiss={handleDismissModal}
                    backgroundStyle={{ backgroundColor: colors.card }}
                >
                    <View style={styles.modalContainerBox}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Typography variant='title03' color='#374785'>Active</Typography>
                                <Typography variant='title02' color='#374785'>{totalUser}</Typography>
                            </View>
                            <View style={styles.modalContent}>
                                <Typography variant='title03' color='#A5D768'>Voted</Typography>
                                <Typography variant='title02' color='#A5D768'>{totalCount}</Typography>
                            </View>
                            <View style={styles.modalContent}>
                                <Typography variant='title03' color='#F76C6C'>Pending</Typography>
                                <Typography variant='title02' color='#F76C6C'>{pendingUser}</Typography>
                            </View>
                        </View>
                        <View style={styles.piChartBox}>
                            <PieChart data={data} />
                        </View>
                    </View>
                </BottomSheetModal>
            </View>
            <View style={styles.progressBarBackground}>
                <View
                    style={[
                        styles.progressBar,
                        {
                            width: `${getWidthPercentage(post.like?.length || 0)}%`,
                            backgroundColor: '#8BC34A',
                        },
                    ]}
                />
                <View
                    style={[
                        styles.progressBar,
                        {
                            width: `${getWidthPercentage(post.neutral?.length || 0)}%`,
                            backgroundColor: '#9E9E9E',
                        },
                    ]}
                />
                <View
                    style={[
                        styles.progressBar,
                        {
                            width: `${getWidthPercentage(post.disLike?.length || 0)}%`,
                            backgroundColor: '#F44336',
                        },
                    ]}
                />
            </View>
        </View>
    );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        marginBottom: SPACING.spacing03,
        backgroundColor: colors.card,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        overflow: 'hidden'
    },
    postContainer: {
        padding: SPACING.spacing03,
    },
    userInfoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: SPACING.spacing02,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    userImage: {
        width: 40,
        height: 40,
        marginRight: SPACING.spacing02,
        borderRadius: RADIUS.full
    },
    username: {
        fontWeight: "bold",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: SPACING.spacing02,
        alignItems: "center",
        gap: SPACING.spacing02
    },
    modalContainerBox: {
        padding: SPACING.spacing03,
        gap: SPACING.spacing02
    },
    modalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalContent: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    piChartBox: {
        alignItems: 'center',
        padding: SPACING.spacing02
    },
    progressBarBackground: {
        flexDirection: 'row',
        height: 7,
        width: '100%',
        backgroundColor: '#cccccc',
        borderRadius: 0,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
});

export default PostCard;
