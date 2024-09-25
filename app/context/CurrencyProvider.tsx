import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

type CurrencyContextType = {
    currency: string;
    changeCurrency: (newCurrency: string) => Promise<void>;
    formatPrice: (amount: number, currency?: string) => string;
};

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    changeCurrency: async () => { },
    formatPrice: (amount, currency = 'USD') => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount),
});

export const useCurrency = () => {
    const [currency, setCurrency] = useState('USD');
    const { getItem, setItem } = useAsyncStorage('@currency');

    useEffect(() => {
        const fetchCurrency = async () => {
            const savedCurrency = await getItem();
            if (savedCurrency) {
                setCurrency(savedCurrency);
            }
        };
        fetchCurrency();
    }, []);

    const changeCurrency = async (newCurrency: string) => {
        setCurrency(newCurrency);
        await setItem(newCurrency);
    };

    const formatPrice = (amount: number, currencyParam?: string) => {
        const formatCurrency = currencyParam || currency;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: formatCurrency,
        }).format(amount);
    };

    return { currency, changeCurrency, formatPrice };
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currency, changeCurrency, formatPrice } = useCurrency();

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrencyContext = () => useContext(CurrencyContext);