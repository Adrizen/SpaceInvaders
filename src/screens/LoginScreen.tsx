import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack'
//import { RootStackParamList } from '../types'

const LoginScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Pantalla de Logueo</Text>
        <Button
          title="Iniciar juego"
          onPress={() => navigation.navigate('Game')}
        />
      </View>
    );
  };
  
  export default LoginScreen;