import React, { PureComponent } from "react";
import { View, StyleSheet } from "react-native";
import Sprite from "../sprite";

interface LivesProps {
  number: number; // El número de las vidas a mostrar.
}

export default class Lives extends PureComponent<LivesProps> {
  renderLives() {
    const { number } = this.props;

    // Asegurarse que el número es positivo.
    const positiveNumber = Math.max(number, 0);

    return Array(positiveNumber)
      .fill(0)
      .map((el, ind) => (
        <Sprite
          key={ind}
          image="cannon"
          width={24}
          style={{ marginHorizontal: 4 }}
        />
      ));
  }

  render() {
    return <View style={styles.base}>{this.renderLives()}</View>;
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
  },
});
