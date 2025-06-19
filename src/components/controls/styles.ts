import { StyleSheet } from "react-native";
import options from "../../config";

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    bottom: -options.cannonSize,
    left: 0,
    zIndex: 2,
  },
  innerView: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  flashView: {
    backgroundColor: "rgba(0,0,0,0)",
  },
});

export default styles;