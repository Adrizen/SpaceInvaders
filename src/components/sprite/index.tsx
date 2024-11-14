import React, { PureComponent } from "react";
import { Image, StyleProp, ImageStyle, StyleSheet } from "react-native";
import { sprites } from "../../config";

interface SpriteProps {
  image: string;
  width: number;
  color?: string;
  style?: StyleProp<ImageStyle>; // Estilos opcionales.
}

export default class Sprite extends PureComponent<SpriteProps> {
  static defaultProps = {
    width: 50,
  };

  get image() {
    const { image } = this.props;
    return sprites[`${image}`];
  }

  render() {
    const { width, color, style } = this.props;

    // Usando flatten para convertir el style en una estructura de nivel único y que TS no se queje.
    const flattenedStyle = StyleSheet.flatten(style) as ImageStyle;

    // Auto height
    // const source = Image.resolveAssetSource(img)
    // const height = width / (source.width / source.height)
    return (
      <Image
        source={this.image}
        style={{ width, height: width, tintColor: color, ...flattenedStyle }}
      />
    );
  }
}
