import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 70,
    fontFamily: "space-invaders",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  linkContainer: {
    marginBottom: 20,
  },
  link: {
    backgroundColor: "#313B72",
    fontFamily: "space-invaders",
    fontSize: 30,
    color: "white",
    padding: 5,
    borderRadius: 25,
    textAlign: "center",
  },
  input: {
    height: 40,
    textDecorationColor: "white",
    color: "white",
    fontFamily: "space-invaders",
    borderColor: "white",
    fontSize: 35,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "green",
    padding: 8,
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 40,
    fontFamily: "space-invaders",
  },
  muteButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
    borderRadius: 1,
    zIndex: 1,
  },
  exitButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 1,
    zIndex: 1,
  },
  topButtonText: {
    fontSize: 70,
  },
  translateButton: {
    position: "absolute",
    top: 50,
    left: 190,
    padding: 10,
    borderRadius: 1,
    zIndex: 1,
  }
});

export default styles;