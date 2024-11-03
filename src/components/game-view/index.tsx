import React, { PureComponent } from "react";
import {
  View,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import Controls from "../controls";
import AliensGrid from "../aliens-grid";
import PlayerRocket from "../rocket/player-rocket";
import AlienRocket from "../rocket/alien-rocket";
import Sky from "../sky";
import Explosion from "../explosion";
import UpperBar from "../upper-bar";


interface RocketData {
  id: string;
  player: number;
  // add other properties in RocketData based on your usage
}

interface ExplosionData {
  [index: number]: number; // assuming it's an array of numbers based on the usage in explosion.length and explosion[1]
}

interface GameViewProps {
  rockets: RocketData[];
  aliens: any; // Replace `any` with the actual type if available
  height: number;
  width: number;
  score: number;
  highest: number;
  playerXPosition: number;
  explosion: ExplosionData;
  winner: number;
  lives: number;
  fire: () => void;
  exit: () => void;
  isPaused: boolean;
  onPausePress: () => void;
  clearExplosion: () => void;
  updatePlayerPosition: (position: number) => void;
  updateScore: (score: number) => void;
  updateLives: () => void;
  removeAlien: (alienId: string) => void;
  removeRocket: (rocketId: string) => void;
}

export default class GameView extends PureComponent<GameViewProps> {
  renderRockets() {
    const {
      rockets,
      aliens,
      height,
      removeAlien,
      removeRocket,
      updateScore,
      playerXPosition,
      updateLives,
    } = this.props;

    return rockets.map((el) =>
      el.player === 1 ? (
        <PlayerRocket
          key={el.id}
          aliens={aliens}
          limit={height}
          rocketData={el}
          removeRocket={removeRocket}
          updateScore={updateScore}
          removeAlien={removeAlien}
        />
      ) : (
        <AlienRocket
          key={el.id}
          playerXPosition={playerXPosition}
          limit={height}
          rocketData={el}
          removeRocket={removeRocket}
          updateLives={updateLives}
        />
      )
    );
  }

  render() {
    const {
      score,
      highest,
      aliens,
      fire,
      width,
      height,
      explosion,
      clearExplosion,
      updatePlayerPosition,
      lives,
      winner,
      exit,
      isPaused,
      onPausePress,
    } = this.props;

    return (
      <SafeAreaView style={styles.base}>
        <StatusBar barStyle="light-content" />

        <View style={styles.container}>
          <UpperBar
            score={score}
            highest={highest}
            lives={lives}
            onButtonPress={exit}
          />

          <TouchableOpacity onPress={onPausePress}>
            {isPaused ? <Text>Play</Text> : <Text>Pause</Text>}
          </TouchableOpacity>

          {isPaused && (
            <View>
              <Text style={{ fontSize: 32 }}>PAUSADO PADREEEEE</Text>
            </View>
          )}

          <AliensGrid config={aliens} width={width} height={height} />

          {explosion.length > 0 && (
            <Explosion
              variant={explosion[1] === 0 ? "2" : "1"}
              position={explosion}
              onAnimationEnd={clearExplosion}
            />
          )}

          {this.renderRockets()}

          {winner !== 2 && (
            <Controls
              fire={fire}
              width={width}
              height={height}
              updatePlayerPosition={updatePlayerPosition}
              lives={lives}
            />
          )}
        </View>

        <Sky width={width} height={height} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#000",
    flex: 1,
  },
  container: {
    paddingTop: Platform.OS === "ios" ? 4 : 24,
    flex: 1,
    zIndex: 1,
  },
  pauseButton: {
    position: "absolute",
  },
});
