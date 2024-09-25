import { Alert } from 'react-native';

type ShowAlertProps = {
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string,
    cancelText?: string
}

const showAlert = ({
    title,
    message,
    onConfirm,
    confirmText,
    cancelText = "Cancel"
}: ShowAlertProps) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: cancelText,
                style: "cancel",
            },
            {
                text: confirmText,
                onPress: onConfirm,
                style: "destructive",
            },
        ],
        { cancelable: false }
    );
}

export default showAlert;
