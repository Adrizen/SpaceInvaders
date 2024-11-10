import React, { PureComponent } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import Scores from '../scores'
import Heading from '../heading'
import Lives from '../lives'

interface UpperBarProps {
    score: number;
    highest: number;
    lives: number;
    onButtonPress: () => void;
}

export default class UpperBar extends PureComponent<UpperBarProps> {

    render() {
        const { score, highest, lives, onButtonPress } = this.props

        return (
            <View style={{ paddingHorizontal: 20 }}>

                <View style={styles.base}>
                    <TouchableOpacity onPress={onButtonPress}>
                        <Heading>SALIR</Heading>
                    </TouchableOpacity>
                    <Lives number={lives} />
                </View>

                <Scores score={score} highest={highest} style={{ paddingTop: 4 }} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 3,
        borderBottomColor: '#fdfdfd',
        borderBottomWidth: StyleSheet.hairlineWidth
    }
})