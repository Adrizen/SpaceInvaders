import React, { PureComponent } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Scores from "../scores";
import Heading from "../heading";
import Lives from "../lives";
import Sprite from "../sprite";

interface UpperBarProps {
  score: number;
  highest: number;
  lives: number;
  isPaused: boolean;
  onExitPress: () => void;
  onPausePress: () => void;
}

export default class UpperBar extends PureComponent<UpperBarProps> {
  render() {
    const { score, highest, lives, onExitPress, onPausePress, isPaused } = this.props;

    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.base}>
          <TouchableOpacity onPress={onExitPress}>
            <Heading>SALIR</Heading>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPausePress}>
            {isPaused ? <Sprite image="play" width={30} /> : <Sprite image="pause" width={30} />}
          </TouchableOpacity>

          <Lives number={lives} />
        </View>

        <Scores score={score} highest={highest} style={{ paddingTop: 4 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 3,
    borderBottomColor: "#fdfdfd",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
