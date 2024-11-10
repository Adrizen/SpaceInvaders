import React from 'react'
import { View, StyleSheet } from 'react-native'
import options from '../../config'


const Star = (props: { position: {x: number, y: number}; big: boolean; luminosity: string; }) => {

    const { position, big, luminosity } = props

    const allStyles = [
        styles.base,
        big && { width: options.starSize * 2, height: options.starSize * 2 },
        {
            top: position.y,
            left: position.x,
            backgroundColor: `rgba(255, 255, 255, ${luminosity})`,
        },
    ]

    return <View style={allStyles} />

}

const styles = StyleSheet.create({
    base: {
        position: 'absolute',
        height: options.starSize,
        width: options.starSize
    }
})

export default Star