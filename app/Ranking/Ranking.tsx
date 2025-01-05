import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ImageBackground,
} from "react-native";
import getRankingData from "../../src/db/queries/ranking";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Font from 'expo-font';

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

export default Ranking;
