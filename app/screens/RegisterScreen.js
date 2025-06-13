import { useNavigation } from "@react-navigation/native";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Ini Register Screen</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate("LoginScreen")}
      />
      <Text>Username</Text>
      <TextInput style={styles.input} />
      <Text>Password</Text>
      <TextInput style={styles.input} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("HomeNavigator")}
      />
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
    input: {
    borderWidth: 1,
    borderRadius: 10,
    width: 350,
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
  },
});
