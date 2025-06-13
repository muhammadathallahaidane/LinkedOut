import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AuthContext from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";

export default function HomeScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  async function handleLogout() {
    await SecureStore.deleteItemAsync("access_token");
    authContext.setIsLoggedIn(false);
  }

  async function tokenCheck() {
    const token = await SecureStore.getItemAsync("access_token");
    console.log(token);
  }

  return (
    <View style={styles.container}>
      <Text>Ini Home Screen</Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate("RegisterScreen")}
      />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Cek Token" onPress={tokenCheck} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "teal",
  },
});
