import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: require('./en.json'),
  es: require('./es.json'),
};


i18n
  .use(initReactI18next) // Unir i18n a React
  .init({
    resources, // Cargar traducciones.
    fallbackLng: 'es', // Usar español si la 'key' enviada no existe.
    //lng: 'en'   // Lenguaje por defecto. Comentar/Descomentar para debuguear.
    lng: 'es' // Lenguaje por defecto. Comentar/Descomentar para debuguear.
  });


export default i18n;
