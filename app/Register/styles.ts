import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    textShadowColor: '#585858',
    textShadowOffset: { width: 5, height: 3 },
    textShadowRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 60,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
    borderColor: "black",
    fontFamily: 'space-invaders',
  },
  input: {
    height: 40,
    borderColor: "white",
    color: "white",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontFamily: 'space-invaders',
    fontSize: 38,
  },
  button: {
    backgroundColor: "green",
    padding: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontFamily: 'space-invaders',
    fontSize: 35,
  },
});

export default styles;