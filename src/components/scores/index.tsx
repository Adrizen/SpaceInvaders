import React, { PureComponent } from 'react'
import { View, StyleSheet, StyleProp, TextStyle } from 'react-native'
import Score from '../score'

interface ScoresProps {
    score: number;
    highest: number;
    style?: StyleProp<TextStyle>; // Estilos opcionales.
}

export default class Scores extends PureComponent<ScoresProps> {
    render() {
        const { score, highest, style } = this.props

        return (
            <View style={[styles.base, StyleSheet.flatten(style)]}>
                <Score label='score' points={score} />
                <Score label='hi-score' points={highest} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})