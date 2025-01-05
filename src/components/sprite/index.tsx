import { PureComponent } from "react";
import { Image, StyleProp, ImageStyle, StyleSheet } from "react-native";
import { sprites } from "../../config";

interface SpriteProps {
  image: string;
  width: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export default class Sprite extends PureComponent<SpriteProps> {
  // Ancho por defecto.
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

    return (
      <Image
        source={this.image}
        style={{ width, height: width, tintColor: color, ...flattenedStyle }}
      />
    );
  }
}
