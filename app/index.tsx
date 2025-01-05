import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ImageBackground,
  BackHandler,
} from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { initDB, getDB } from "../src/db/db";
import loginUser from "../src/db/queries/login";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from "expo-font";
import { Audio } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import Sprite from "../src/components/sprite";

const MainScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Reproducción de música de fondo.
  const playMusic = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/music/Galactic Dancers.mp3"),
      { volume: isMuted ? 0 : 1 }
    );
    setSound(sound);
    await sound.setIsLoopingAsync(true);
    await sound.playAsync();
  };

  // Mutear o desmutear la música.
  const toggleMute = async () => {
    if (sound) {
      if (isMuted) {
        await sound.setVolumeAsync(1.0);
      } else {
        await sound.setVolumeAsync(0);
      }
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    initDB(); // Inicializa la base de datos.
    playMusic();

    const loadFonts = async () => {
      await Font.loadAsync({
        "space-invaders": require("../assets/fonts/Silver.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();

    const unlockOrientation = async () => {
      await ScreenOrientation.unlockAsync(); // Permite orientación en todas las pantallas. En la del juego se bloquea.
    };

    unlockOrientation();

    // Limpieza de recursos.
    return () => {
      if (sound) {
        sound.unloadAsync(); 
      }
    };
  }, []);

  // Logueo en pantalla inicial.
  const login = () => {
    try {
      const user = loginUser(name, password);

      if (user) {
        setIsLoggedIn(true);
        Alert.alert("Logueado", "Logueado con éxito.");
      } else {
        Alert.alert("Error", "Usuario o contraseña incorrectos.");
      }
    } catch (error) {
      console.error("Error en el logueo", error);
    } finally {
      const db = getDB();
      db.closeSync();
    }
  };

  // TODO: Tengo que hacer un botón para traducir de Español a Inglés y viceversa. La PUTA QUE LO PARIO.  AQUIENCARAJO SE LE OCURRE.
  // TODO: Probar colocar tanto alien-rocket como player-rocket en un solo archivo.

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center" }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/images/nebula.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.exitButton}>
        <Text
          style={styles.exitButtonText}
          onPress={() => BackHandler.exitApp()}
        >
          <Sprite image="exit"/>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
        <Text style={styles.muteButtonText}>
          {isMuted ? <Sprite image="mute" /> : <Sprite image="unmute" />}
        </Text>
      </TouchableOpacity>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Space Invaders</Text>
        {isLoggedIn ? (
          <View>
            <Text style={styles.title}>Bienvenido {name}</Text>
            <View style={styles.linkContainer}>
              <Link style={styles.link} href="/Ranking/Ranking">
                Ver ranking
              </Link>
            </View>

            <View style={styles.linkContainer}>
              <Link
                style={styles.link}
                href={{
                  pathname: "/GameScreen/GameScreen",
                  params: { name: name }, // Envia el parámetro de nombre.
                }}
              >
                Iniciar juego
              </Link>
            </View>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nombre de usuario"
              placeholderTextColor={"white"}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={"white"}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
              <Link style={styles.link} href="/Register/Register">
                Registrarse
              </Link>
            </View>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MainScreen;

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
  button: {
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
  muteButtonText: {
    fontSize: 35,
  },
  exitButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    borderRadius: 1,
    zIndex: 1,
  },
  exitButtonText: {
    fontSize: 35,
  },
});
