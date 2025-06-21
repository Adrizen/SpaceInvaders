import {
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
import styles from "./styles";
import { useTranslation } from "react-i18next";


const Register = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const { t } = useTranslation(); // Traducción de textos.

  // Cargar la fuente personalizada.
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'space-invaders': require('../../assets/fonts/Silver.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Registrar un usuario.
  const handleRegister = () => {
    if (!name || !password) {
      Alert.alert("Error", t('completeFields'));
      return;
    }

    try {
      setLoading(true);
      const success = registerUser(name, password);

      if (success){
        Alert.alert("Éxito", t('accountCreated'));
        setName("");
        setPassword("");
      }
    } catch (error) {
      Alert.alert("Error", t('accountCreatedError'));
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
        <Text style={styles.title}>{t('register')}</Text>

        <TextInput
          style={styles.input}
          placeholder={t('username')}
          placeholderTextColor={"white"}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t('password')}
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
            {loading ? t('creating') : t('register')}
            </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};


export default Register;
