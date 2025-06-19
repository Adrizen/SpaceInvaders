import { PureComponent } from "react";
import { Animated, Easing } from "react-native";
import styles from "./styles";
import options from "../../config";

interface PlayerRocketProps {
  rocketData: {
    id: number;
    x: number;
    y: number;
  };
  limit: number;
  aliens: Array<{ id: number; x: number; y: number }>;
  removeRocket: (id: number) => void;
  updateScore: () => void;
  removeAlien: (id: number) => void;
}

interface PlayerRocketState {
  translateY: Animated.Value;  // Posición del cohete en el eje Y.
  xPosition: number;           // Posición fija del cohete en el eje X.
}

// Offset para determinar la posición de los aliens.
const offset = {
  bottom: options.alienSize - options.alienSize * 0.8,
  top: options.alienSize * 0.8,
};

export default class PlayerRocket extends PureComponent<PlayerRocketProps, PlayerRocketState> {
  private rocketListener: string | undefined;

  constructor(props: PlayerRocketProps) {
    super(props);

    this.state = {
      translateY: new Animated.Value(0),
      xPosition: this.props.rocketData.x + options.cannonSize / 2 - 2.5, // centrar el cohete en el jugador.
    };
  }

  componentDidMount() {
    const { translateY } = this.state;
    const { limit, removeRocket, rocketData } = this.props;

    // Listener de posición Y del cohete para revisar colisiones.
    this.rocketListener = translateY.addListener(({ value }) => {
      this.checkCollisions(Math.abs(value));
    });

    // Animar el cohete hacia arriba.
    Animated.timing(this.state.translateY, {
      toValue: -limit,
      // Movimiento del cohete lineal.
      easing: Easing.linear,
      duration: options.rocketSpeed,
      useNativeDriver: true,
    }).start(() => removeRocket(rocketData.id)); // Al final de la animación, quitar el cohete.
  }

  checkCollisions(position) {
    const { translateY, xPosition: rocketXPosition } = this.state;
    const { aliens, rocketData, updateScore, removeAlien } = this.props;

    // Si ya no hay aliens, borrar el listener.
    if (!aliens.length) {
      translateY.removeListener(this.rocketListener);
      return;
    }

    const rocketYPosition = position + rocketData.y + 15; // altura del misil
    const firstAlien = aliens[0];
    const lastAlien = aliens[aliens.length - 1];

    // Si el misil aún no alcanzó un alien, saltar los checks.
    if (rocketYPosition < firstAlien.y - 10) return;

    // Si el misil pasa el último alien sin tocar ninguno, ya no hay necesidad de chequear por colisiones.
    if (rocketYPosition > lastAlien.y + (options.alienSize - 10)) {
      translateY.removeListener(this.rocketListener);
      return;
    }

    for (let i = 0; i < aliens.length; i++) {
      /*
       * Hitbox de los aliens con sus límites:
       *    1___y2___
       *    |        |
       *  x1|        |x2
       *    |________|
       *    0   y1   1
       */
      const y1Threshold = aliens[i].y + offset.bottom; // abajo
      const y2Threshold = y1Threshold + offset.top; // arriba
      const x1Threshold = aliens[i].x; // izquierda
      const x2Threshold = x1Threshold + options.alienSize; // derecha

      // Chequear si el misil está dentro de una hitbox de algun alien (Y1 < missile < Y2 and X1 < missile < X2)
      if (
        rocketYPosition > y1Threshold &&
        rocketYPosition < y2Threshold &&
        rocketXPosition > x1Threshold &&
        rocketXPosition < x2Threshold
      ) {
        translateY.removeListener(this.rocketListener);
        translateY.stopAnimation();
        removeAlien(aliens[i].id);
        updateScore();
        break;
      }
    }
  }

  render() {
    const { translateY, xPosition } = this.state;
    const { rocketData } = this.props;

    // Estilo del cohete.
    const animatedStyle = {
      transform: [{ translateY }],
      bottom: rocketData.y - 10,  // altura del cohete.
      left: xPosition,
    };

    return <Animated.View style={[styles.basePlayer, animatedStyle]} />;
  }
}