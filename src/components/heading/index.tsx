import React, { PureComponent, ReactNode } from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface HeadingProps {
  children: ReactNode; // Contenido dentro del elemento Heading.
  color?: string; // Color opcional.
  style?: TextStyle; // Estilos opcionales.
  upperCase?: boolean; // Mayúsculas estilo opcional.
}

export default class Heading extends PureComponent<HeadingProps> {
  static defaultProps: Partial<HeadingProps> = {
    color: "#fdfdfd",
  };

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
    fontFamily: "monospace",
    fontSize: 18,
  },
});
