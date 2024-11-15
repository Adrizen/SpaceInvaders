import React, { PureComponent } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import GameScreen from "./src/screens/GameScreen";
import GameScreenFunctional from "./src/screens/GameScreenFunctional";

const Stack = createStackNavigator();

export default class App extends PureComponent {
  
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Game" component={GameScreenFunctional} options={{headerShown: false}} />
          {/* <Stack.Screen name="Game" component={GameScreen} options={{headerShown: false}} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
