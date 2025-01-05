import { PureComponent, ReactNode } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";
import * as Font from "expo-font";

interface HeadingProps {
  children: ReactNode; 
  color?: string;
  style?: TextStyle;
  upperCase?: boolean;
}

export default class Heading extends PureComponent<HeadingProps> {
  static defaultProps: Partial<HeadingProps> = {
    color: "#fdfdfd",
  };

  // Cargar la font al montar el componente.
  componentDidMount() {
    const loadFonts = async () => {
      await Font.loadAsync({
        "space-invaders": require("../../../assets/fonts/Silver.ttf"),
      });
    };

    loadFonts();
  }

  render() {
    const { children, color, style, upperCase } = this.props;

    const allStyles: TextStyle[] = [
      styles.base,
      { color, textTransform: upperCase ? "uppercase" : "none", ...style },
    ];

    return <Text style={allStyles}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "space-invaders", 
    fontSize: 35,
  },
});
