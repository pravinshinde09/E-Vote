import { Currency } from "../types/currencyType";
import { Language } from "../types/languageType";

export const InitialTitle : Record<Language, string> = { en: '', fr: '', pl: '', de: '' };
export const InitialDetails: Record<Language, string> = { en: '', fr: '', pl: '', de: '' };

export const InitialCurrency : Record<Currency, string> = { USD: '', INR: '', EUR: '' };

export const InitialNutritionalDetailsState = {
    size: '',
    calories: '',
    fat: '',
    carbs: '',
    proteins: '',
    salt: '',
};

export const LANGUAGES: Language[] = ['en', 'fr', 'pl', 'de'];
export const CURRENCIES: Currency[] = ['USD', 'INR', 'EUR'];

