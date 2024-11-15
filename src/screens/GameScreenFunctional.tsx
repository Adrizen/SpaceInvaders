import { useNavigation } from "@react-navigation/native";
import GameView from "../components/game-view";
import config from "../config";
import React, { useState, useEffect } from "react";
import { Dimensions, Vibration, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";

const { width, height } = Dimensions.get("window");

const GameScreenFunctional = () => {
  const navigation = useNavigation();
  const [winner, setWinner] = useState(0); // 0: nadie, 1: jugador, 2: computadora
  const [speed, setSpeed] = useState(0);
  const [playerXPosition, setPlayerXPosition] = useState(0);
  const [lives, setLives] = useState(0);
  const [aliens, setAliens] = useState([]);
  const [direction, setDirection] = useState(0);
  const [down, setDown] = useState(false);
  const [rockets, setRockets] = useState([]);
  const [score, setScore] = useState(0);
  const [highest, setHighest] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  //const [delay, setDelay] = useState();
  const [delay, setDelay] = useState<string | number | NodeJS.Timeout>();
  //const [gameLoop, setGameLoop] = useState();
  const [gameLoop, setGameLoop] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const initGame = () => {
      if (winner !== 0) {
        reinitState();
      }

      generateAliens();
      setGameLoop(setInterval(() => renderFrame(), speed));
    };

    initGame();

    const hasAliens = aliens.length > 1;
    const aliensChanged = aliens.length !== aliens.length;  // TODO: Acá me rompio el orto.

    if (winner === 0 && !isPaused && hasAliens && aliensChanged) {
      increaseSpeed(speed);
    }

    if (winner) {
      winner === 1 ? victory() : gameOver();
    }

    return () => {
      clearInterval(gameLoop);
      setGameLoop(null);  // TODO: Esto lo agregué io.
    };
  }, []);

  const initGame = () => {
    if (delay) clearTimeout(delay);
    if (winner) reinitState();

    generateAliens();
    setGameLoop(setInterval(() => renderFrame(), speed));
  };

  const reinitState = () => {
    setWinner(0);
    setSpeed(config.startingGameSpeed);
    setDirection(1);
    setDown(false);
    if (winner !== 1) {
      setLives(config.numberOfLives);
      setAliens([]);
      setScore(0);
    }
  };

  const victory = () => {
    clearInterval(gameLoop);
    setGameLoop(null);  // TODO: Esto lo agregué io
    setDelay(setTimeout(() => initGame(), 500));
  }

  const gameOver = () => {
    clearInterval(gameLoop);
    setGameLoop(null);  // TODO: Esto lo agregué io.
    setHighest(Math.max(score, highest));

    Alert.alert(
      "GAME OVER",
      "¡Los alien han ganado!",
      [
        //{ text: "Cerrar", onPress: () => this.exit(), style: "cancel" },
        { text: "Nuevo juego", onPress: () => initGame() },
      ],
      { cancelable: false }
    );
  }

  const increaseSpeed = (startingSpeed: number) => {
    clearInterval(gameLoop); // Limpiar el intervalo actual.
    setGameLoop(null); // TODO: Esto lo agregué io.

    // La velocidad se incrementa un x% comparado a su último valor.
    const newSpeed = +(startingSpeed - startingSpeed * config.speedMultiplier).toFixed(0);

    setGameLoop(setInterval(() => renderFrame(), newSpeed));
  }

  const renderFrame = () => {
    if (!isPaused) {
      const dX = down ? 0 : config.aliensHorStep * direction;
      const dY = down ? config.aliensVerStep : 0;

      const aliens = moveAliens(dX, dY);

      // Mecánica de disparo de los Aliens.
      const doesShoot = Math.random() < config.shootingProbability;
      if (doesShoot) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        fire({ x: randomAlien.x, y: randomAlien.y }, 2);
      }

      // Devuelve un nuevo array de aliens, como FRAME FINAL.
      setAliens(aliens);
    }
  };

  const generateAliens = () => {
    const alienHorSpace = config.alienSize + config.aliensHorDistance;
    const alienVerSpace = config.alienSize + config.aliensVerDistance;

    const offsetForCentering = config.aliensHorDistance / 2;
    const xOffset = offsetForCentering + (width - alienHorSpace * Math.max(...config.aliensInit)) / 2; // Para apuntar a los aliens.
    const yOffset = alienVerSpace + alienVerSpace * 0.4;

    config.aliensInit.map((el, ind) => {
      for (let i = 0; i < el; i++) {
        const type = ind + 1;
        const num = i + 1;
        // Ejemplo de elemento alien { id: 't1n1', t: 1, x: 120, y: 40 }
        aliens.push({
          id: `t${type}n${num}`,
          t: type,
          x: xOffset + alienHorSpace * i,
          y: height - alienVerSpace * (ind + 1) - yOffset,
        });
      }
    });
    aliens.reverse(); // Los primeros del array deben ser los más cercanos al fondo.
    setAliens(aliens);
  };

  const fire = (launchPos, player = 1) => {
    if (rockets.length === config.maxRocketsOnScreen) return;
    const id = Math.random().toString(36).substring(2, 8);
    const newRockets = [...rockets, { id, player, ...launchPos }];
    setRockets(newRockets);
  };

  const moveAliens = (dX: number, dY: number) => {
    /* Con aliens en varias filas, los limites de inversión se repiten por cada una, lo que causa un bug en la dirección, que es revertido varias veces. 
	    Por lo tanto el check es ejecutado solo una vez, si necesita ser revertido varias veces no hace falta revisarlo otra vez */
    let inversionTrue = false;

    // Resetear el estado 'down', por defecto los aliens no deberían bajar.
    setDown(false);

    const clonedAliens = cloneState(aliens);

    clonedAliens.forEach((el) => {
      el.x += dX;
      el.y -= dY;

      if (inversionTrue) return;  // TODO: Necesario?

      // Reversa si los aliens están offscreen. Se revisa si los alien se dirigen a la misma dirección que el marco, para evitar un bug en renderFrame
      if ((direction === 1 && el.x + (config.alienSize + 16) > width) || (direction === -1 && el.x < 16)) {
        setDirection(direction * -1)
        inversionTrue = true;
      }
      if (el.y <= config.cannonSize) setWinner(2);
    });

    return clonedAliens;
  }

  const onExitPress = () => {
    Vibration.vibrate(100);
    navigation.goBack();
  };

  const cloneState = (source) => {
      // Para clonar arrays compuestos por objetos [{...}, {...}, {...}]
      source.map((el) => Object.assign({}, el));
      return source;
  }

  const removeAlien = (id: number) => {
    const clonedAliens = cloneState(aliens);

    const killedAlienInd = clonedAliens.findIndex((el) => el.id === id);
    const killedAlienType = clonedAliens[killedAlienInd].t;

    // Encontrar los siguientes aliens en la misma fila.
    const nextAliens = clonedAliens.filter((el, ind) => el.id !== id && el.t === killedAlienType && ind < killedAlienInd);

    // Mueve la siguiente fila de aliens por una diferencia igual al espacio ocupado por un alien.
    nextAliens.forEach((el) => el.x + config.aliensHorSpace);
    clonedAliens.splice(killedAlienInd, 1);

    if (clonedAliens.length === 0) {
      setWinner(1);
    }
    setAliens(clonedAliens);
  }

  const removeRocket = (id: number) => {
    const rocketInd = rockets.findIndex((el) => el.id === id);
    rockets.splice(rocketInd, 1);
    setRockets(rockets);
  }

  const updateScore = () => {
    setScore(score + 1);
  }

  const updatePlayerPosition = (value) => {
    setPlayerXPosition(value);
  }

  const updateLives = () => {
    setLives(lives - 1);
    if (lives === 0) {
      setWinner(2);
    }
  }

  const togglePause = () => {
    Vibration.vibrate(100);
    if (isPaused) {
      // Reanudar juego.
      setGameLoop(setInterval(() => renderFrame(), speed))
    } else {
      // Pausar juego.
      if (gameLoop) {
        clearInterval(gameLoop);
        setGameLoop(null);
      }
    }
    setIsPaused(!isPaused);
  }

  return (
    <GameView
    width={width}
    height={height}
    score={score}
    updateScore={updateScore}
    highest={highest}
    fire={fire}
    rockets={rockets}
    removeRocket={removeRocket}
    aliens={aliens}
    removeAlien={removeAlien}
    playerXPosition={playerXPosition}
    updatePlayerPosition={updatePlayerPosition}
    lives={lives}
    updateLives={updateLives}
    winner={winner}
    onExitPress={onExitPress}
    isPaused={isPaused}
    onPausePress={togglePause}
  />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-around",
  },
  buttonContainer: {
    margin: 20,
    gap: 8,
    backgroundColor: "black",
  },
});

export default GameScreenFunctional;
