import React, { ReactNode } from "react";
import { StyleProp, Text, TextStyle } from 'react-native';
import { TypographyStyles } from '../theme/typography';
import { useTheme } from '../context/ThemeProvider';


type Variants = "title01" | "title02" | "title03" | "title04" | "body01" | "body02";

type Props = {
    variant: Variants;
    children: ReactNode;
    numberOfLines?: number;
    style?: StyleProp<TextStyle>;
    color?: string;
};

const Typography = ({ children, variant, numberOfLines, style, color }: Props) => {
    const { colors } = useTheme();
    return (
        <Text style={[TypographyStyles[variant], style, { color: color || colors.text }]} numberOfLines={numberOfLines}>{children}</Text>
    );
};

export default Typography;

