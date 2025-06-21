import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 60,
    fontFamily: "space-invaders",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#7DABE0",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rank: {
    fontWeight: "bold",
  },
  name: {
    flex: 1,
    marginLeft: 10,
  },
  score: {
    fontWeight: "bold",
  },
});

export default styles;