// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeNavigator from "./navigators/HomeNavigator";
import client from "./config/apollo";
import { ApolloProvider } from "@apollo/client";
import AuthContext from "./contexts/AuthContext";
import { useEffect, useState } from "react";
import UserDetailNavigator from "./navigators/UserDetailNavigator";
import * as SecureStore from "expo-secure-store";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    tokenValid();
  }, []);

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
        user: { username: "currentUser" }, // Add user context for isLiked functionality
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f3f2ef" translucent={false}/>
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
                <Stack.Screen
                  name="UserDetailNavigator"
                  component={UserDetailNavigator}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="RegisterScreen"
                  component={RegisterScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="LoginScreen" component={LoginScreen}
                options={{ headerShown: false }} />
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
