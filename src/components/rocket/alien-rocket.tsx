import React, { PureComponent } from 'react';
import { StyleSheet, Animated, Easing } from 'react-native';
import options from '../../config';

interface AlienRocketProps {
    rocketData: {
        id: number;
        x: number;
        y: number;
    };
    limit: number;
    playerXPosition: number;
    removeRocket: (id: number) => void;
    updateLives: () => void;
}

interface AlienRocketState {
    translateY: Animated.Value;
    xPosition: number;
}

export default class AlienRocket extends PureComponent<AlienRocketProps, AlienRocketState> {
    /*
        * Los alien disparan hacía abajo, la posición del cohete es obtenida empezando por el valor de translateY
        * Posición inicial: valor del fondo (compensado)
        * Movimiento: trasladar hacia abajo, convertir como si fuese el fondo: +x
        * Posición del jugador: valor desde el fondo.
        * CollisionY: cuando rocketY < playerY
    */

    private rocketListener: string | undefined;

    constructor(props: AlienRocketProps) {
        super(props);
        
        this.state = {
            translateY: new Animated.Value(0),
            xPosition: this.props.rocketData.x + options.alienSize / 2 - 2.5 // mitad del ancho del misil.
        };
    }

    componentDidMount() {
        const { translateY } = this.state;
        const { limit, removeRocket, rocketData } = this.props;

        this.rocketListener = translateY.addListener(({ value }) => {
            this.checkCollisions(Math.abs(value));
        });

        // Animar el movimiento del chohete hacia abajo.
        Animated.timing(translateY, {
            // Cuanto trasladar para tocar el fondo depende de la posición inicial del cohete.
            toValue: limit - (limit - rocketData.y),
            easing: Easing.linear,
            // Duración más corta a medida que los alien descienden, ya que el misil tiene que recorrer menos distancia.
            duration: options.rocketSpeed * Math.sqrt(rocketData.y / limit),
            useNativeDriver: true
        }).start(() => removeRocket(rocketData.id)); // Remove the rocket at the end of the animation
    }

    componentWillUnmount() {
        if (this.rocketListener) {
            this.state.translateY.removeListener(this.rocketListener);
        }
    }

    checkCollisions(position: number) {
        const { translateY, xPosition: rocketXPosition } = this.state;
        const { playerXPosition, rocketData, limit, updateLives } = this.props;

        // posición es relativa, empieza desde 0 con respecto a la posición de spawn del misil; hay que compensar eso.
        // En el caso de los aliens, convierte la posición desde top: +x hacia bottom: +x
        const rocketYPosition = limit - (position + (limit - rocketData.y));

        // Antes de llegar al cañon, no hay necesidad de revisarlo.
        if (rocketYPosition > options.cannonSize + 20) return;

        const y2Threshold = options.cannonSize; // above: altura del cañon desde abajo, que permanence fija.
        const x1Threshold = playerXPosition;    // izquierda
        const x2Threshold = x1Threshold + options.cannonSize;   // derecha.

        // HIT!
        if (rocketYPosition < y2Threshold && rocketXPosition > x1Threshold && rocketXPosition < x2Threshold) {
            if (this.rocketListener) translateY.removeListener(this.rocketListener);
            translateY.stopAnimation();
            updateLives();
        }
    }

    render() {
        const { translateY, xPosition } = this.state;
        const { rocketData } = this.props;

        const animatedStyle = {
            transform: [{ translateY }],
            bottom: rocketData.y - 15,  // altura del cohete.
            left: xPosition
        };

        return <Animated.View style={[styles.base, animatedStyle]} />;
    }
}

const styles = StyleSheet.create({
    base: {
        width: 5,
        height: 15,
        backgroundColor: 'red',
        position: 'absolute'
    }
});
