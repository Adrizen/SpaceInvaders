import { StyleSheet } from "react-native";
import options from "../../config";

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    width: options.alienSize,
    height: options.alienSize,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default styles;