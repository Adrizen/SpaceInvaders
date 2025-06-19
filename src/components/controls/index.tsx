import React, { PureComponent, RefObject } from "react";
import {
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Sprite from "../sprite";
import options from "../../config";
import styles from "./styles";

const cannonHalf = options.cannonSize / 2;  // Mitad del tamaño del cañon.

interface ControlsProps {
  width: number;
  height: number;
  lives: number;
  fire: (position: { x: number; y: number }) => void;
  updatePlayerPosition: (position: number) => void;
  isPaused: boolean;
}

export default class Controls extends PureComponent<ControlsProps> {
  scrollView: RefObject<ScrollView>;
  cannonXPosition: number;
  translateY: Animated.Value;
  opacity: Animated.Value;
  coolDown: boolean;

  constructor(props: ControlsProps) {
    super(props);
    this.scrollView = React.createRef<ScrollView>();
    this.cannonXPosition = this.props.width / 2;
    this.translateY = new Animated.Value(0);
    this.opacity = new Animated.Value(1);
    this.coolDown = false;
  }

  // Mover el cañon al centro y animar su aparición.
  componentDidMount() {
    const { width } = this.props;
    setTimeout(
      () =>
        this.scrollView.current.scrollTo({
          x: width / 2 - cannonHalf,
          y: 0,
          animated: false,
        }),
      250
    );

    Animated.timing(this.translateY, {
      toValue: -options.cannonSize,
      easing: Easing.bezier(0.04, 0.38, 0.18, 0.93),
      delay: 200,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }

  // Transparentar y opacar el cañon cuando recibe un misil enemigo.
  componentDidUpdate(prevProps: ControlsProps) {
    if (this.props.lives > 0 && prevProps.lives !== this.props.lives) {
      Animated.sequence([
        Animated.timing(this.opacity, {
          toValue: 0.2,
          easing: Easing.linear,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(this.opacity, {
          toValue: 1,
          easing: Easing.linear,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  // Disparar cañon.
  fire = () => {
    const { fire, isPaused } = this.props;

    if (!this.coolDown && !isPaused) {
      // Evitar disparar si está en cooldown o pausado.
      fire({ x: this.cannonXPosition, y: options.cannonSize });
      this.coolDown = true;
      setTimeout(() => (this.coolDown = false), options.rocketCoolDown);
    }
  };

  // Calcular la posición del cañon en base al scroll.
  calculateCannonPosition(offset: number) {
    const { width, updatePlayerPosition } = this.props;
    
    const currentPosition = width - options.cannonSize - offset;
    this.cannonXPosition = currentPosition;
    updatePlayerPosition(this.cannonXPosition);
  }

  render() {
    const { width, height } = this.props;

    const animatedStyle = { transform: [{ translateY: this.translateY }] };

    // Área dónde funcionan los controles (disparar y mover).
    const touchableArea = [
      styles.innerView,
      { width: width * 2 - options.cannonSize },
    ]; 

    return (
      <Animated.View
        style={[styles.base, { height: height / 2, ...animatedStyle }]}
      >
        <ScrollView
          ref={this.scrollView}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          decelerationRate={0.01}
          scrollEventThrottle={50}
          onScroll={({
            nativeEvent,
          }: NativeSyntheticEvent<NativeScrollEvent>) =>
            this.calculateCannonPosition(nativeEvent.contentOffset.x)
          }
        >
          <TouchableWithoutFeedback onPress={this.fire}>
            <View style={touchableArea}>
              <Animated.View
                style={[styles.flashView, { opacity: this.opacity }]}
              >
                <Sprite image="cannon" width={options.cannonSize} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </Animated.View>
    );
  }
}

