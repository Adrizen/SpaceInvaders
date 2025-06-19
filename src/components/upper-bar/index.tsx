import { PureComponent } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Scores from "../scores";
import Sprite from "../sprite";
import styles from "./styles";

interface UpperBarProps {
  score: number;
  highest: number;
  lives: number;
  isPaused: boolean;
  onPausePress: () => void;
}

export default class UpperBar extends PureComponent<UpperBarProps> {
  render() {
    const { score, highest, lives, onPausePress, isPaused } = this.props;

    return (
      <View style={{ paddingHorizontal: 10, paddingTop: 20 }}>
        <View style={styles.base}>
          <View style={styles.leftContainer}>
            <Text style={styles.livesText}>LIVES: {lives}</Text>
          </View>
          <View style={styles.centerContainer}>
            <TouchableOpacity onPress={onPausePress}>
              {isPaused ? (
                <Sprite image="play" width={35} />
              ) : (
                <Sprite image="pause" width={35} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.rightContainer}>
            <Text>{}</Text>
          </View>
        </View>

        <Scores score={score} highest={highest} style={{ paddingTop: 4 }} />
      </View>
    );
  }
}

