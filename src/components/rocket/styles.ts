import { StyleSheet } from "react-native";
import options from "../../config";

const styles = StyleSheet.create({
  baseAlien: {
    width: 5,
    height: 15,
    backgroundColor: "red",
    position: "absolute",
  },
  basePlayer: {
    width: 5,
    height: 15,
    backgroundColor: options.mainColor,
    position: "absolute",
  },
});

export default styles;