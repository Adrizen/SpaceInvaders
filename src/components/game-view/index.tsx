import React, { PureComponent } from "react";
import { View, StatusBar, StyleSheet, SafeAreaView, Text } from "react-native";
import Controls from "../controls";
import AliensGrid from "../aliens-grid";
import PlayerRocket from "../rocket/player-rocket";
import AlienRocket from "../rocket/alien-rocket";
import UpperBar from "../upper-bar";

interface RocketData {
  id: number;
  player: number;
  x: number;
  y: number;
}

interface GameViewProps {
  rockets: RocketData[];
  aliens: any;
  height: number;
  width: number;
  score: number;
  highest: number;
  playerXPosition: number;
  winner: number;
  lives: number;
  fire: (launchPos: any, player?: number) => void;
  onExitPress: () => void;
  isPaused: boolean;
  onPausePress: () => void;
  updatePlayerPosition: (position: number) => void;
  updateScore: () => void;
  updateLives: () => void;
  removeAlien: (alienId: number) => void;
  removeRocket: (rocketId: number) => void;
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
      updatePlayerPosition,
      lives,
      winner,
      onExitPress,
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
            isPaused={isPaused}
            onExitPress={onExitPress}
            onPausePress={onPausePress}
          />

          {isPaused && (
            <View>
              <Text style={{ fontSize: 32 }}>PAUSADO PADREEEEE</Text>
            </View>
          )}

          <AliensGrid
            config={aliens} //width={width} height={height} // TODO: Revisar. Antes era con el width y height sin comentar.
          />

          {this.renderRockets()}

          {winner !== 2 && (
            <Controls
              fire={fire}
              width={width}
              height={height}
              updatePlayerPosition={updatePlayerPosition}
              lives={lives}
              isPaused={isPaused}
            />
          )}
        </View>
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
    paddingTop: 24,
    flex: 1,
    zIndex: 1,
  },
  pauseButton: {
    position: "absolute",
  },
});
