import { PureComponent } from "react";
import { Animated, Easing } from "react-native";
import options from "../../config";
import styles from "./styles";

interface AlienRocketProps {
  rocketData: {
    id: number;
    x: number;
    y: number;
  };
  limit: number;  // Límite de la pantalla.
  playerXPosition: number;
  removeRocket: (id: number) => void;
  updateLives: () => void;
}

interface AlienRocketState {
  translateY: Animated.Value; // Posición del cohete en el eje Y.
  xPosition: number;          // Posición fija del cohete en el eje X.
}

export default class AlienRocket extends PureComponent<AlienRocketProps, AlienRocketState> {
  private rocketListener: string | undefined;

  constructor(props: AlienRocketProps) {
    super(props);

    this.state = {
      translateY: new Animated.Value(0),
      xPosition: this.props.rocketData.x + options.alienSize / 2 - 2.5, // centrar el cohete en el alien.
    };
  }

  componentDidMount() {
    const { translateY } = this.state;
    const { limit, removeRocket, rocketData } = this.props;

    // Escuchar la posición Y del cohete para revisar colisiones.
    this.rocketListener = translateY.addListener(({ value }) => {
      this.checkCollisions(Math.abs(value));
    });

    // Animar el movimiento del chohete hacia abajo.
    Animated.timing(translateY, {
      // Cuanto trasladar para tocar el fondo de la pantalla, depende de la posición inicial del cohete.
      toValue: limit - (limit - rocketData.y),
      // Movimiento del cohete lineal.
      easing: Easing.linear,
      // Duración más corta a medida que los alien descienden, ya que el misil tiene que recorrer menos distancia.
      duration: options.rocketSpeed * Math.sqrt(rocketData.y / limit),
      useNativeDriver: true,
    }).start(() => removeRocket(rocketData.id)); // Eliminar el cohete cuando llegue al fondo.
  }

  componentWillUnmount() {
    // Eliminar el listener para evitar memory leaks.
    if (this.rocketListener) {
      this.state.translateY.removeListener(this.rocketListener);
    }
  }

  // Revisar si el cohete colisiona con el cañon.
  checkCollisions(position: number) {
    const { translateY, xPosition: rocketXPosition } = this.state;
    const { playerXPosition, rocketData, limit, updateLives } = this.props;

    // Se obtiene la posición del cohete en el eje Y, respecto al fondo de la pantalla.
    const rocketYPosition = limit - (position + (limit - rocketData.y));

    // Antes de llegar al cañon, no hay necesidad de revisarlo.
    if (rocketYPosition > options.cannonSize + 20) return;

    // Posiciones de los límites del cañon.
    const y2Threshold = options.cannonSize; // arriba.
    const x1Threshold = playerXPosition; // izquierda
    const x2Threshold = x1Threshold + options.cannonSize; // derecha.

    // Revisar si el cohete colisiona con el cañon.
    if (
      rocketYPosition < y2Threshold &&
      rocketXPosition > x1Threshold &&
      rocketXPosition < x2Threshold
    ) {
      if (this.rocketListener) translateY.removeListener(this.rocketListener);
      translateY.stopAnimation();
      updateLives();
    }
  }

  render() {
    const { translateY, xPosition } = this.state;
    const { rocketData } = this.props;

    // Estilo del cohete.
    const animatedStyle = {
      transform: [{ translateY }],
      bottom: rocketData.y - 15, // altura del cohete.
      left: xPosition,
    };

    return <Animated.View style={[styles.baseAlien, animatedStyle]} />;
  }
}

