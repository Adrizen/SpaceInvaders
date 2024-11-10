import React, { PureComponent, ReactNode } from 'react'
import { Text, StyleSheet, TextStyle, Platform, StyleProp } from 'react-native'

interface HeadingProps {
    children: ReactNode; // Contenido dentro del elemento Heading.
    color?: string; // Color opcional.
    style?: StyleProp<TextStyle>; // Estilos opcionales.
    upperCase?: boolean; // Mayúsculas estilo opcional.
}

export default class Heading extends PureComponent<HeadingProps> {
    static defaultProps: Partial<HeadingProps> = {
        color: '#fdfdfd'
    };
    
    render() {
        const { children, color, style, upperCase } = this.props;

        const allStyles = [
            styles.base,
            {color, textTransform: upperCase ? 'uppercase' : 'none'},
            StyleSheet.flatten(style)
        ];

        return <Text //style={allStyles}
                     >{children}</Text>;
    }
}

const styles = StyleSheet.create({
    base: {
        fontFamily: 'monospace',
        fontSize: 18
    }
});
