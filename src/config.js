const options = {
    startingGameSpeed: 1000,
    speedMultiplier: 0.08,
    rocketSpeed: 1600,
    rocketCoolDown: 800, // El intervalo de tiempo entre un misil y otro.

    aliensInit: [5, 5, 5], // 3 filas, cada una con 5 aliens;
    //aliensInit: [1], // Para DEBUG.
    aliensHorDistance: 20,
    aliensVerDistance: 20,
    aliensHorStep: 20,
    aliensVerStep: 30,
    shootingProbability: 0.25,
    
    maxRocketsOnScreen: 4,
    numberOfLives: 3,

    cannonSize: 50,
    alienSize: 40,

    mainColor: '#22cc00' // texto y misiles del jugador.
}

// Los sprites tiene que ser cuadrados.
export const sprites = {
    cannon: require('../assets/512/cannon.png'),
    alien1_1: require('../assets/512/alien1_1.png'),
    alien1_2: require('../assets/512/alien1_2.png'),
    alien2_1: require('../assets/512/alien2_1.png'),
    alien2_2: require('../assets/512/alien2_2.png'),
    alien3_1: require('../assets/512/alien3_1.png'),
    alien3_2: require('../assets/512/alien3_2.png'),
    play: require('../assets/512/play.png'),
    pause: require('../assets/512/pause.png')
}

export default options