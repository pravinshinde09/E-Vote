import React, { useEffect, useReducer, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Modal, Alert } from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../TextInput";
import { useLanguage } from '../../context/LocalizationContext';
import { StyleProps, useTheme } from "../../context/ThemeProvider";
import { deleteAvatarImage, uploadAvatarImage } from "../../appwriteDB/storage";
import { APPWRITE_AVATAR_BUCKETS_ID, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "../../appwrite/appWriteConfig";
import { SPACING, RADIUS } from "../../theme";
import { UserData } from "./Type";
import ImageSelector from "../ImageSelector";
import { reducer, initialState } from "../../utils/reducer";
import { setField } from "../action";

type ModalData = {
    field: keyof UserData | null;
    value: string;
};

type Props = {
    userData: UserData;
    onUpdateProfile: (updatedProfile: Partial<UserData>) => void;
}

const PersonalDetails = ({ userData, onUpdateProfile }: Props) => {
    const { colors } = useTheme();
    const styles = getStyles({ colors });
    const [state, dispatch] = useReducer(reducer, initialState);

    const [modalData, setModalData] = useState<ModalData>({ field: null, value: "" });
    const [user, setUser] = useState<UserData>({ ...userData });
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setUser({ ...userData });
    }, [userData]);

    const handleEditProfile = (field: keyof UserData) => {
        if (field === "imageUrl") {
            setModalData({ field: "imageUrl", value: "" });
        } else {
            setModalData({ field, value: user[field] || "" });
        }
        setModalVisible(true);
    };
    const handleSaveChanges = () => {
        if (modalData.field !== null) {
            setUser((prevUser) => ({
                ...prevUser,
                [modalData.field!]: modalData.value,
            }));

            onUpdateProfile({ [modalData.field!]: modalData.value });
        }
        setModalData({ field: null, value: "" });
        setModalVisible(false);
    };

    const handleImagePick = async (pickerResult: string) => {
        if (state.isUploading) return;
        dispatch(setField({ isUploading: true }));

        try {
            if (user.imageId) {
                await deleteAvatarImage(user.imageId);
                console.log('Old image deleted successfully');
            }

            const data = await uploadAvatarImage(pickerResult);
            dispatch(setField({ imageUrl: data.imageUrl }));
            setUser((prevUser) => ({
                ...prevUser,
                imageUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_AVATAR_BUCKETS_ID}/files/${data.$id}/view?project=${APPWRITE_PROJECT_ID}`,
                imageId: data.$id,
            }));

            onUpdateProfile({
                imageId: data.$id,
                imageUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_AVATAR_BUCKETS_ID}/files/${data.$id}/view?project=${APPWRITE_PROJECT_ID}`,
            });

        } catch (error) {
            console.error('Image upload error:', error);
            Alert.alert(translate('image_upload_failed'));
        } finally {
            dispatch(setField({ isUploading: false }));
        }
    };

    const { translate } = useLanguage();
    return (
        <View>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={() => handleEditProfile("imageUrl")}>
                    {user.imageUrl ? (
                        <Image
                            source={{ uri: user.imageUrl }}
                            style={styles.avatar}
                        />
                    ) : (
                        <MaterialIcons
                            name="account-circle"
                            size={80}
                            color={colors.primary100}
                        />
                    )}
                    <View style={styles.editImageOption}>
                        <MaterialIcons name="mode-edit" size={16} color={colors.icon} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
                <Typography variant={"title03"} style={{ fontWeight: '700', alignSelf: "center", padding: SPACING.spacing02 }}>{translate('personal_details')}</Typography>
                <View style={styles.mainDivider} />
                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Name</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.name}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("name")} style={styles.editOption} />
                </View>
                <View style={styles.mainDivider} />
                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Email</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.email}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("email")} style={styles.editOption} />
                </View>
                <View style={styles.mainDivider} />
                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Contact No</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.phoneNumber}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("phoneNumber")} style={styles.editOption} />
                </View>
                <View style={styles.mainDivider} />
                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Bio</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.bio}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("bio")} style={styles.editOption} />
                </View>
                <View style={styles.mainDivider} />
                <Typography variant={"title03"} style={{ fontWeight: '700' }}>Organization Id</Typography>
                <View style={styles.userInfoFields}>
                    <Typography variant="title04">{user.organizationId}</Typography>
                    <MaterialIcons name="mode-edit" size={16} onPress={() => handleEditProfile("organizationId")} style={styles.editOption} />
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalContainer}>
                    <TouchableOpacity
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.modalContent}>
                            <Typography variant="title02" style={styles.modalTitleStyle}>
                                {translate('Add or Update')} {modalData.field}
                            </Typography>
                            {modalData.field === "imageUrl" ? (
                                <ImageSelector onImageSelected={handleImagePick} imageUrl={user.imageUrl} />
                            ) : (
                                <Input
                                    style={styles.modalInput}
                                    value={modalData.value}
                                    onChangeText={(text) =>
                                        setModalData({ ...modalData, value: text })
                                    }
                                    autoFocus={true}
                                    keyboardType="default"
                                />
                            )}
                            <Button onPress={handleSaveChanges}>{translate('save')}</Button>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <AntDesign name="closecircle" size={35} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    profileContainer: {
        alignItems: "center",
        marginBottom: SPACING.spacing02
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: RADIUS.full,
    },
    userInfo: {
        gap: SPACING.spacing02,
    },
    userInfoFields: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingLeft: SPACING.spacing01
    },
    editOption: {
        paddingHorizontal: SPACING.spacing02,
        color: colors.icon
    },
    editImageOption: {
        position: "absolute",
        right: SPACING.spacing01,
        bottom: SPACING.spacing01,
        borderWidth: 2,
        padding: SPACING.spacing01,
        backgroundColor: colors.primary,
        borderColor: colors.white,
        borderRadius: RADIUS.full,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: colors.transparentBlack,
    },
    modalContent: {
        backgroundColor: colors.card,
        padding: SPACING.spacing03,
        paddingTop: SPACING.spacing04,
        borderTopRightRadius: SPACING.spacing04,
        borderTopLeftRadius: SPACING.spacing04,
        gap: SPACING.spacing03,
    },
    modalTitleStyle: {
        fontWeight: "800",
    },
    modalInput: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        fontSize: 16,
        borderRadius: RADIUS.small,
        paddingHorizontal: SPACING.spacing02,
    },
    closeButton: {
        position: "absolute",
        top: -50,
        right: 10,
    },
    mainDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.icon,
        width: "100%",
    },
});

export default PersonalDetails;
