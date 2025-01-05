import {
  StyleSheet,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useEffect, useState } from "react";
import registerUser from "../../src/db/queries/register";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from 'expo-font';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'space-invaders': require('../../assets/fonts/Silver.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();

  }, []);

  const handleRegister = () => {
    if (!name || !password) {
      Alert.alert("Error", "Por favor completar los campos de registro");
      return;
    }

    try {
      setLoading(true);
      const success = registerUser(name, password);

      if (success){
        Alert.alert("Cuenta creada", "Cuenta creada con éxito.");
        setName("");
        setPassword("");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un error al intentar crear la cuenta.");
      console.error("Error en el registro", error);
    } finally {
      setLoading(false);
    }
  };

    // Simple "loader".
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{textAlign: "center"}} >Cargando...</Text>
      </SafeAreaView>
    )
  }

  return (
    <ImageBackground
      source={require("../../assets/images/witch-nebula.jpg")}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Registrarse</Text>
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creando..." : "Registrarse"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

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

export default Register;
