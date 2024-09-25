import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Typography from '../Typography';
import { useCurrencyContext } from '../../context/CurrencyProvider';
import { SPACING } from '../../theme';
import { StyleProps, useTheme } from '../../context/ThemeProvider';
import { useLanguage } from '../../context/LocalizationContext';

const ChangeCurrency: React.FC = () => {
    const { currency, changeCurrency } = useCurrencyContext();

    const handleCurrencyChange = (newCurrency: string) => {
        changeCurrency(newCurrency);
    };
    const { colors } = useTheme();
    const styles = getStyle({ colors });
    const { translate } = useLanguage();


    return (
        <View style={{ padding: 20 }}>
            <Typography variant='title04'>{translate("select_currency")}:</Typography>
            <View style={styles.currencyContainer}>
                {['USD', 'INR', 'EUR',].map((item) => (
                    <View key={item}>
                        <TouchableOpacity onPress={() => handleCurrencyChange(item)} style={styles.currencyItem}>
                            <Text style={[styles.currencyText, currency === item && styles.selected]}>{item}</Text>
                            {currency === item && <Text style={styles.checkmark}>✓</Text>}
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const getStyle = ({ colors }: StyleProps) => StyleSheet.create({
    currencyContainer: {
        marginTop: SPACING.spacing02,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.spacing01,
        justifyContent: 'space-between'
    },
    currencyText: {
        color: colors.text,
        fontSize: 16,
    },
    selected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    checkmark: {
        color: colors.primary,
        fontSize: 16,
    },
    divider: {
        marginVertical: SPACING.spacing02,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        width: "100%",
        alignSelf: 'center'
    }
});

export default ChangeCurrency;
