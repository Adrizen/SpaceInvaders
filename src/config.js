const options = {
    startingGameSpeed: 1000,
    speedMultiplier: 0.08,
    rocketSpeed: 1600,
    rocketCoolDown: 800, // El intervalo de tiempo entre un misil y otro.

    aliensInit: [5, 5, 5], // 3 filas, cada una con 5 aliens; GRID ESTANDAR.
    //aliensInit: [5], // Para DEBUG.
    aliensHorDistance: 20,  // Distancia entre aliens horizontal.
    aliensVerDistance: 20,  // Distancia entre aliens vertical.
    aliensHorStep: 20,  // Cantidad de pixeles que se mueven los aliens horizontalmente.
    aliensVerStep: 30,  // Cantidad de pixeles que se mueven los aliens verticalmente.
    shootingProbability: 0.25,
    
    maxRocketsOnScreen: 4,
    numberOfLives: 3,   // Vidas del jugador.

    cannonSize: 50, // Tamaño de la nave del jugador.
    alienSize: 40,

    mainColor: '#7DABE0' // Color de texto y de los misiles del jugador.
}

export const sprites = {
    cannon: require('../assets/512/space-ship.png'),	
    alien1_1: require('../assets/512/alien1_1.png'),
    alien1_2: require('../assets/512/alien1_2.png'),
    alien2_1: require('../assets/512/alien2_1.png'),
    alien2_2: require('../assets/512/alien2_2.png'),
    alien3_1: require('../assets/512/alien3_1.png'),
    alien3_2: require('../assets/512/alien3_2.png'),
    exit: require('../assets/512/logout.png'),
    mute: require('../assets/512/volume-mute.png'),
    unmute: require('../assets/512/volume.png'),
    play: require('../assets/512/play.png'),
    pause: require('../assets/512/pause.png')
}

export default options