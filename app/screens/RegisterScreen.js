import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

const REGISTER = gql`
  mutation CreateUser($newUser: CreateUserInput) {
    createUser(newUser: $newUser)
  }
`;

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState({
    email: "",
    name: "",
    password: "",
    username: "",
  });

  const [register, { loading, error, data }] = useMutation(REGISTER, {
    onCompleted: (result) => {
      navigation.navigate("LoginScreen");
    },
    onError: (error) => {
      Alert.alert(JSON.stringify(error.message))
    }
  });

  if (loading)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );

  function handleRegister() {
    register({
      variables: {
        newUser: {
          email: input.email,
          name: input.name,
          password: input.password,
          username: input.username,
        },
      },
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Login"
        onPress={() => navigation.navigate("LoginScreen")}
      />
      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={input.email}
        onChangeText={(text) => {
          setInput({
            ...input,
            email: text,
          });
        }}
      />
      <Text>Name</Text>
      <TextInput
        style={styles.input}
        value={input.name}
        onChangeText={(text) => {
          setInput({
            ...input,
            name: text,
          });
        }}
      />

      <Text>Username</Text>
      <TextInput
        style={styles.input}
        value={input.username}
        onChangeText={(text) => {
          setInput({
            ...input,
            username: text,
          });
        }}
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={input.password}
        onChangeText={(text) => {
          setInput({
            ...input,
            password: text,
          });
        }}
      />

      <Button title="Register" onPress={handleRegister} />
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
