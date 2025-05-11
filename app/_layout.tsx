import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";  // Provider de i18n, usado para traducciones.
import i18n from "../src/locales/i18n"; // Configuración de i18n.

/*
 * Archivo y estructura necesaria para el funcionamiento del navegador de pantallas expo-router.
 * Es por esto que existe la carpeta app donde dentro están las pantallas.
 */

const RootLayout = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GameScreen/GameScreen"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </I18nextProvider>
  );
};

export default RootLayout;
