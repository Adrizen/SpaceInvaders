import React, { PureComponent } from 'react';
import GameView from "../components/game-view";
import config from '../config'
import { Dimensions, Alert, Vibration } from "react-native";

const { width, height } = Dimensions.get("window");

interface GameStateProps {
  winner: number;
  speed: number;
  playerXPosition: number;
  lives: number;
  aliens: any[];
  direction: number;
  down: boolean;
  rockets: any[];
  score: number;
  highest: number;
  isPaused: boolean;
}

export default class GameScreen extends PureComponent<{}, GameStateProps> {
  
  state: GameStateProps = {
    winner: 0, // 0: nadie, 1: jugador, 2: computadora
    speed: config.startingGameSpeed,
    playerXPosition: 0,
    lives: config.numberOfLives,
    aliens: [],
    direction: 1,
    down: false,
    rockets: [],
    score: 0,
    highest: 0,
    isPaused: true,
  };
  delay: string | number | NodeJS.Timeout;
  gameLoop: NodeJS.Timeout;

  componentDidMount() {
    this.initGame();
  }

  componentDidUpdate(prevProps, prevState) {
    const { winner, aliens } = this.state;

    // Un alien menos, incrementar la velocidad.
    // No debe ser llamado en init (cuando antes hubo un ganador) o la velocidad no se va a reiniciar.
    if (
      !prevState.isPaused &&  // No está pausado.
      !prevState.winner && // No hay un ganador.
      prevState.aliens.length > 1 && // Hay al menos un alien.
      prevState.aliens.length !== aliens.length // La cantidad de aliens cambio con respecto al estado anterior.
    ) {
      this.increaseSpeed(prevState.speed); // aumentar velocidad.
    }

    // Hay un ganador (y solo si no había uno antes)
    if (!prevState.winner && winner) {
      winner === 1 ? this.victory() : this.gameOver();
    }
  }

  initGame() {
    const { winner } = this.state;

    if (this.delay) clearTimeout(this.delay);
    if (winner) this.reinitState();

    this.generateAliens();
    this.gameLoop = setInterval(() => this.renderFrame(), this.state.speed);
  }

  reinitState() {
    const common = {
      winner: 0,
      speed: config.startingGameSpeed,
      direction: 1,
      down: false,
      lives: this.state.lives,
      aliens: this.state.aliens,
      score: this.state.score,
    };
    //this.setState(this.state.winner === 1 ? { ...common } : { ...common, lives: config.numberOfLives, aliens: [], score: 0 });
    this.setState(  // De nuevo, para que TS no se queje.
      this.state.winner === 1
      ? { ...common }
      : { ...common, lives: config.numberOfLives, aliens: [], score: 0 }
    )
  }

  victory() {
    clearInterval(this.gameLoop);
    this.delay = setTimeout(() => this.initGame(), 500);
  }

  gameOver() {
    const { score, highest } = this.state;

    clearInterval(this.gameLoop);
    this.setState({
      highest: Math.max(score, highest),
    });

    Alert.alert(
      "GAME OVER",
      "¡Los alien han ganado!",
      [
        { text: "Cerrar", onPress: () => this.exit(), style: "cancel" },
        { text: "Nuevo juego", onPress: () => this.initGame() },
      ],
      { cancelable: false }
    );
  }

  exit(): void {
    throw new Error('Method not implemented.');
  }


  increaseSpeed(startingSpeed) {
    clearInterval(this.gameLoop); // Limpiar el intervalo actual.

    // La velocidad se incrementa un x% comparado a su último valor.
    const newSpeed = +(startingSpeed - startingSpeed * config.speedMultiplier).toFixed(0);

    this.setState({ speed: newSpeed }, () => {
      this.gameLoop = setInterval(() => this.renderFrame(), newSpeed);
    });
  }

  // Para clonar arrays compuestos por objetos [{...}, {...}, {...}]
  cloneState = (source) => source.map((el) => Object.assign({}, el));

  generateAliens() {
    const aliens = [];

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

    this.setState({ aliens });
  }

  moveAliens(dX: number, dY: number) {
    const { aliens, direction } = this.state;

    /* Con aliens en varias filas, los limites de inversión se repiten por cada una, lo que causa un bug en la dirección, que es revertido varias veces. 
	    Por lo tanto el check es ejecutado solo una vez, si necesita ser revertido varias veces no hace falta revisarlo otra vez */
    let inversionTrue = false;

    // Resetear el estado 'down', por defecto los aliens no deberían bajar.
    this.setState({ down: false });

    const clonedAliens = this.cloneState(aliens);

    clonedAliens.forEach((el) => {
      el.x += dX;
      el.y -= dY;

      if (inversionTrue) return;

      // Reversa si los aliens están offscreen. Se revisa si los alien se dirigen a la misma dirección que el marco, para evitar un bug en renderFrame
      if ((direction === 1 && el.x + (config.alienSize + 16) > width) || (direction === -1 && el.x < 16)) {
        this.setState((prevState) => ({
          //direction: (prevState.direction *= -1),
          direction: (prevState.direction * -1),
          down: true,
        }));
        inversionTrue = true;
      }

      if (el.y <= config.cannonSize) this.setState({ winner: 2 });
    });

    return clonedAliens;
  }

  renderFrame() {
    const { direction, down, isPaused } = this.state;

    if (!isPaused) {
      console.log(isPaused + "pausao?");
      const dX = down ? 0 : config.aliensHorStep * direction;
      const dY = down ? config.aliensVerStep : 0;

      const aliens = this.moveAliens(dX, dY);

      // Mecánica de disparo de los Aliens.
      const doesShoot = Math.random() < config.shootingProbability;
      if (doesShoot) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        this.fire({ x: randomAlien.x, y: randomAlien.y }, 2); 
      }

      // Devuelve un nuevo array de aliens, como FRAME FINAL.
      this.setState({ aliens });
    }
  }

  removeAlien = (id) => {
    const { aliens } = this.state;

    const clonedAliens = this.cloneState(aliens);

    const killedAlienInd = clonedAliens.findIndex((el) => el.id === id);
    const killedAlienType = clonedAliens[killedAlienInd].t;

    // Encontrar los siguientes aliens en la misma fila.
    const nextAliens = clonedAliens.filter((el, ind) => el.id !== id && el.t === killedAlienType && ind < killedAlienInd);

    // Mueve la siguiente fila de aliens por una diferencia igual al espacio ocupado por un alien.
    nextAliens.forEach((el) => el.x + config.aliensHorSpace);

    const commonState = {
      aliens: clonedAliens,
    };

    clonedAliens.splice(killedAlienInd, 1);

    //this.setState(clonedAliens.length === 0 ? { ...commonState, winner: 1 } : commonState);
    this.setState(clonedAliens.length === 0 ? { ...commonState, winner: 1, aliens: clonedAliens} 
                                            : {...commonState, winner: this.state.winner, aliens: clonedAliens} ) // Para que TS no se queje.
  };

  fire = (launchPos, player = 1) => {
    // Diferenciar los misiles por jugador, hay que saber quién disparó.
    const { rockets: stateRockets } = this.state;

    if (stateRockets.length === config.maxRocketsOnScreen) return;

    const id = Math.random().toString(36).substring(2, 8);

    const rockets = [...stateRockets, { id, player, ...launchPos }];

    this.setState({ rockets });
  };

  removeRocket = (id) => {
    const { rockets: stateRockets } = this.state;

    const rockets = this.cloneState(stateRockets);
    const rocketInd = rockets.findIndex((el) => el.id === id);

    rockets.splice(rocketInd, 1);

    this.setState({ rockets });
  };

  updateScore = () => this.setState((prevState) => ({ score: prevState.score + 1 }));

  updatePlayerPosition = (value) => this.setState({ playerXPosition: value });

  updateLives = () => {
    this.setState((prevState) => {
      const lives = prevState.lives - 1;
      return { lives, winner: lives === 0 ? 2 : prevState.winner }  // Para que no se queje TS.
      //return lives === 0 ? { lives, winner: 2 } : { lives };
    });
  };

  onExitPress() {
    Vibration.vibrate(100);
    console.log("Salir");
  }

  togglePause = () => {
    Vibration.vibrate(100);
    const { isPaused } = this.state;
    if (isPaused) {
      // Reanudar juego.
      this.gameLoop = setInterval(() => this.renderFrame(), this.state.speed);
    } else {
      // Pausar juego.
      if (this.gameLoop) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
      }
    }

    this.setState({ isPaused: !isPaused });
  };
  render() {
    const { score, highest, rockets, aliens, playerXPosition, lives, winner, isPaused } = this.state;

    return (
      <GameView
        width={width}
        height={height}
        score={score}
        updateScore={this.updateScore}
        highest={highest}
        fire={this.fire}
        rockets={rockets}
        removeRocket={this.removeRocket}
        aliens={aliens}
        removeAlien={this.removeAlien}
        playerXPosition={playerXPosition}
        updatePlayerPosition={this.updatePlayerPosition}
        lives={lives}
        updateLives={this.updateLives}
        winner={winner}
        onExitPress={this.onExitPress}
        isPaused={isPaused}
        onPausePress={this.togglePause}
      />
    );
  }
}