import { gql, useLazyQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as SecureStore from "expo-secure-store";

const LOGIN = gql`
  query Login($username: String, $password: String) {
    login(username: $username, password: $password)
  }
`;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const [loginQuery, { loading, data, error }] = useLazyQuery(LOGIN, {
    onCompleted: async function (result) {
      await SecureStore.setItemAsync("access_token", result.login);
    },
  });

  if (loading)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
  if (error)
    return (
      <View>
        <Text>error... {error.message}</Text>
      </View>
    );

  function handleLogin() {
    loginQuery({
      variables: {
        username: input.username,
        password: input.password
      }
    })
  }

  async function tokenCheck() {
    const token = await SecureStore.getItemAsync("access_token")
    console.log(token);
    
  }

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate("RegisterScreen")}
      />
      <Button
        title="Home"
        onPress={() => navigation.navigate("HomeNavigator")}
      />
      <Button
        title="Cek Token"
        onPress={tokenCheck}
      />
      <Text>{JSON.stringify(input, null, 2)}</Text>
      <Text>Username</Text>
      <TextInput
        style={styles.input}
        value={input.username}
        onChangeText={(text) =>
          setInput({
            ...input,
            username: text,
          })
        }
      />
      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={input.password}
        onChangeText={(text) =>
          setInput({
            ...input,
            password: text,
          })
        }
      />
      <View style={{ width: 200, marginTop: 100 }}>
        <Button
          title="Login"
          onPress={handleLogin}
        />
      </View>
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
    margin: 5,
    backgroundColor: "#fff",
  },
  button: {
    width: 200,
  },
});
