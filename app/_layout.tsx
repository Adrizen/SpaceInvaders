import { Stack } from "expo-router"

/*
    * Archivo y estructura necesaria para el funcionamiento del navegador de pantallas expo-router.
    * Es por esto que existe la carpeta app donde dentro están las pantallas.
*/

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: false,
            }} />
            <Stack.Screen name="GameScreen/GameScreen" options={{
                headerShown: false,
            }} />
        </Stack>
    )
}

export default RootLayout;