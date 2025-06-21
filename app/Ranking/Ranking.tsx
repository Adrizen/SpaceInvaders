import {
  View,
  Text,
  FlatList,
  ImageBackground,
} from "react-native";
import getRankingData from "../../src/db/queries/ranking";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from 'expo-font';
import styles from "./styles";

const Ranking = () => {
  const [rankingData, setRankingData] = useState<{ id: number; name: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Buscar la info. del ranking.
    const fetchData = () => {
      try {
        const data = getRankingData();
        setRankingData(data);
      } catch (error) {
        console.error("Error cargando datos del ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cargar la fuente personalizada.
    const loadFonts = async () => {
      await Font.loadAsync({
        'space-invaders': require('../../assets/fonts/Silver.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  // Simple "loader".
  if (loading && !fontsLoaded) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/astronaut.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Ranking</Text>
        <FlatList
          data={rankingData}
          renderItem={({ item, index }) => (
            <View style={styles.item}>
              <Text>{item.id}.</Text>
              <Text>{item.name}</Text>
              <Text>{item.score}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Ranking;
