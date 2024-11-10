import React, { PureComponent } from "react";
import { Dimensions, Alert } from "react-native";
import GameView from "./src/components/game-view";
import options from "./src/config";

const { width, height } = Dimensions.get("window");

export default class App extends PureComponent {
  state = {
    winner: 0, // 0: nadie, 1: jugador, 2: computadora
    speed: options.startingGameSpeed,
    playerXPosition: 0,
    lives: options.numberOfLives,
    aliens: [],
    direction: 1,
    down: false,
    rockets: [],
    explosion: [],
    score: 0,
    highest: 0,
    //isPaused: false,
  };

  componentDidMount() {
    this.initGame();
  }

  componentDidUpdate(prevProps, prevState) {
    const { winner, aliens } = this.state;

    // Un alien menos, incrementar la velocidad.
    // No debe ser llamado en init (cuando antes hubo un ganador) o la velocidad no se va a reiniciar.
    if (
      !prevState.winner &&	// No hay un ganador.
      prevState.aliens.length > 1 &&	// Hay al menos un alien.
      prevState.aliens.length !== aliens.length	// La cantidad de aliens cambio con respecto al estado anterior.
    ) {
      this.increaseSpeed(prevState.speed);	// aumentar velocidad.
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
      speed: options.startingGameSpeed,
      direction: 1,
      down: false,
    };
    this.setState(
      this.state.winner === 1
        ? { ...common }
        : { ...common, lives: options.numberOfLives, aliens: [], score: 0 }
    );
  }

  exit() {
    console.log("Salir");
  }

  victory() {
    clearInterval(this.gameLoop);
    this.delay = setTimeout(() => this.initGame(), 500);
  }

  gameOver() {
    const { score, highest, playerXPosition } = this.state;

    clearInterval(this.gameLoop);
    this.setState({
      highest: Math.max(score, highest),
      explosion: [playerXPosition, 0],
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

  increaseSpeed(startingSpeed) {
    clearInterval(this.gameLoop);	// Limpiar el intervalo actual.

    // La velocidad se incrementa un x% comparado a su último valor.
    const newSpeed = +(startingSpeed - startingSpeed * options.speedMultiplier).toFixed(0);

    this.setState({ speed: newSpeed }, () => {
      this.gameLoop = setInterval(() => this.renderFrame(), newSpeed);
    });
  }

  // Para clonar arrays compuestos por objetos [{...}, {...}, {...}]
  cloneState = (source) => source.map((el) => Object.assign({}, el));

  generateAliens() {
    const aliens = [];

    const alienHorSpace = options.alienSize + options.aliensHorDistance;
    const alienVerSpace = options.alienSize + options.aliensVerDistance;

    const offsetForCentering = options.aliensHorDistance / 2;
    const xOffset =
      offsetForCentering +
      (width - alienHorSpace * Math.max(...options.aliensInit)) / 2; // Para apuntar a los aliens.
    const yOffset = alienVerSpace + alienVerSpace * 0.4;

    options.aliensInit.map((el, ind) => {
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

  moveAliens(dX, dY) {
    const { aliens, direction, playerXPosition } = this.state;

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
      if (
        (direction === 1 && el.x + (options.alienSize + 16) > width) ||
        (direction === -1 && el.x < 16)
      ) {
        this.setState((prevState) => ({
          direction: (prevState.direction *= -1),
          down: true,
        }));
        inversionTrue = true;
      }

      if (el.y <= options.cannonSize)
        this.setState({ winner: 2, explosion: [playerXPosition, 0] });
    });

    return clonedAliens;
  }

  renderFrame() {
    const { direction, down } = this.state;

    const dX = down ? 0 : options.aliensHorStep * direction;
    const dY = down ? options.aliensVerStep : 0;

    const aliens = this.moveAliens(dX, dY);

    const doesShoot = Math.random() < options.shootingProbability;
    if (doesShoot) {
      const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
      this.fire({ x: randomAlien.x, y: randomAlien.y }, 2);
    }

    // Devuelve un nuevo array de aliens, como FRAME FINAL.
    this.setState({ aliens });
  }

  removeAlien = (id) => {
    const { aliens } = this.state;

    const clonedAliens = this.cloneState(aliens);

    const killedAlienInd = clonedAliens.findIndex((el) => el.id === id);
    const killedAlienType = clonedAliens[killedAlienInd].t;

    // Encontrar los siguientes aliens en la misma fila.
    const nextAliens = clonedAliens.filter(
      (el, ind) =>
        el.id !== id && el.t === killedAlienType && ind < killedAlienInd
    );

    // Mueve la siguiente fila de aliens por una diferencia igual al espacio ocupado por un alien.
    nextAliens.forEach((el) => el.x + options.aliensHorSpace);

    const commonState = {
      aliens: clonedAliens,
      // Coordenadas para renderizar la explosión.
      explosion: [
        clonedAliens[killedAlienInd].x,
        clonedAliens[killedAlienInd].y,
      ],
    };

    clonedAliens.splice(killedAlienInd, 1);

    this.setState(
      clonedAliens.length === 0 ? { ...commonState, winner: 1 } : commonState
    );
  };

  fire = (launchPos, player = 1) => {
    // Diferenciar los misiles por jugador, hay que saber quién disparó.
    const { rockets: stateRockets } = this.state;

    if (stateRockets.length === options.maxRocketsOnScreen) return;

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

  updateScore = () =>
    this.setState((prevState) => ({ score: prevState.score + 1 }));

  updatePlayerPosition = (value) => this.setState({ playerXPosition: value });

  updateLives = () => {
    this.setState((prevState) => {
      const lives = prevState.lives - 1;
      return lives === 0 ? { lives, winner: 2 } : { lives };
    });
  };

  clearExplosion = () => this.setState({ explosion: [] });

  render() {
    const {
      score,
      highest,
      rockets,
      aliens,
      explosion,
      playerXPosition,
      lives,
      winner,
	    //isPaused,
    } = this.state;

	// togglePause = () => {
	// 	const { isPaused } = this.state;

	// 	if (isPaused) {
	// 		// Reanudar juego.
	// 		this.gameLoop = setInterval(() => this.renderFrame(), this.state.speed);
	// 	} else {
	// 		// Pausar juego.
	// 		if (this.gameLoop) {
	// 			clearInterval(this.gameLoop);
	// 			this.gameLoop = null;
	// 		}
	// 	}

	// 	this.setState({ isPaused: !isPaused });
	// }

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
        explosion={explosion}
        clearExplosion={this.clearExplosion}
        playerXPosition={playerXPosition}
        updatePlayerPosition={this.updatePlayerPosition}
        lives={lives}
        updateLives={this.updateLives}
        winner={winner}
        exit={this.exit}
		    //isPaused={isPaused}
		    //onPausePress={this.togglePause}
      />
    );
  }
}
