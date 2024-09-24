import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import { SPACING } from "../../theme";
import { AntDesign } from "@expo/vector-icons";
import Typography from "../Typography";
import { useLanguage } from '../../context/LocalizationContext';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { type StyleProps, useTheme } from "../../context/ThemeProvider";

const Setting = () => {
    const navigation = useNavigation()
    const { translate } = useLanguage();
    const { colors } = useTheme();
    const styles = getStyles({ colors });

    return (

        <View style={styles.container}>
            <Typography variant={"title03"}>{translate('setting')}</Typography>

            <View style={{ padding: 4, paddingTop: 8 }} >
                <TouchableOpacity onPress={() => navigation.navigate('SelectLanguage' as never)} style={styles.iconTextStyle}>
                    <FontAwesome name="language" size={24} style={styles.iconStyle} />
                    <Typography variant="title04">{translate('language')}</Typography>
                    <AntDesign name="right" size={20} color="black" style={[styles.iconStyle, styles.arrowIcon]} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity onPress={() => navigation.navigate('Theme' as never)} style={styles.iconTextStyle}>
                    <MaterialCommunityIcons name="theme-light-dark" size={24} style={styles.iconStyle} />
                    <Typography variant="title04">{translate('theme')}</Typography>
                    <AntDesign name="right" size={20} color="black" style={[styles.iconStyle, styles.arrowIcon]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const getStyles = ({ colors }: StyleProps) => StyleSheet.create({
    container: {
        gap: SPACING.spacing02,
    },
    iconStyle: {
        color: colors.icon
    },
    arrowIcon: {
        position: 'absolute',
        right: 4
    },
    iconTextStyle: {
        flexDirection: 'row',
        gap: SPACING.spacing03
    },
    divider: {
        marginVertical: SPACING.spacing02,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        width: "85%",
        alignSelf: 'flex-end',
        marginRight: SPACING.spacing02,
    }
});

export default Setting;
