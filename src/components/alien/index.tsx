import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import Sprite from "../sprite";
import options from "../../config";

interface AlienProps {
  id: number;
  type: string; // Tipo de alien.
  variant: number; // Variante de alien.
  left: number; // Posición izquierda de la pantalla.
  bottom: number; // Posición inferior de la pantalla.
}

export default class Alien extends PureComponent<AlienProps> {
  // Obtener la imagen del alien.
  get type(): string {
    const { type, variant } = this.props;
    return `alien${type}_${variant}`;
  }

  render() {
    const { left, bottom } = this.props;
    const dynamicStyles = [styles.base, { left, bottom }];

    return (
      <View style={dynamicStyles}>
        <Sprite image={this.type} width={options.alienSize} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    width: options.alienSize,
    height: options.alienSize,
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: 'blue'
  },
});
