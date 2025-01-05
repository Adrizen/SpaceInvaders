import { PureComponent } from "react";
import { View, StyleSheet, StyleProp, TextStyle } from "react-native";
import Score from "../score";

interface ScoresProps {
  score: number;
  highest: number;
  style?: StyleProp<TextStyle>; // Estilos opcionales.
}

// Corresponde a la barra de puntajes que se muestra en la parte superior de la pantalla.
export default class Scores extends PureComponent<ScoresProps> {
  render() {
    const { score, highest, style } = this.props;

    // Usando flatten para convertir el style en una estructura de nivel único y que TS no se queje.
    return (
      <View style={[styles.base, StyleSheet.flatten(style)]}>
        <Score label="score" points={score} />
        <Score label="high-score" points={highest} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
