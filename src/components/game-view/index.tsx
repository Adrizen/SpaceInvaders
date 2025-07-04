import { PureComponent } from "react";
import { View, StatusBar, SafeAreaView } from "react-native";
import Controls from "../controls";
import AliensGrid from "../aliens-grid";
import PlayerRocket from "../rocket/player-rocket";
import AlienRocket from "../rocket/alien-rocket";
import UpperBar from "../upper-bar";
import styles from "./styles";

interface RocketData {
  id: number;
  player: number; // 1 = player, 2 = alien
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
            onPausePress={onPausePress}
          />

          <AliensGrid
            config={aliens}
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

