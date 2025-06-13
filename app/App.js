// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeNavigator from "./navigators/HomeNavigator";
import client from "./config/apollo";
import { ApolloProvider } from "@apollo/client";
import AuthContext from "./contexts/AuthContext";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    tokenValid()
  }, [])

  async function tokenValid() {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      setIsLoggedIn(true);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            {isLoggedIn ? (
              <>
                <Stack.Screen
                  name="HomeNavigator"
                  component={HomeNavigator}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="RegisterScreen"
                  component={RegisterScreen}
                />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
