import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Alert,
  Button,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AuthContext from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_POSTS = gql`
  query GetAllPost {
    getAllPost {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      authorData {
        _id
        name
        username
      }
    }
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { loading, data, error } = useQuery(GET_ALL_POSTS, {
    onError: (error) => {
      Alert.alert(JSON.stringify(error.message));
    },
  });

  if (loading)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );

  async function handleLogout() {
    await SecureStore.deleteItemAsync("access_token");
    authContext.setIsLoggedIn(false);
  }

  // async function tokenCheck() {
  //   const token = await SecureStore.getItemAsync("access_token");
  //   console.log(token);
  // }

  return (
    <View style={styles.container}>
      <Text>Ini Home Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
      {/* <Button title="Cek Token" onPress={tokenCheck} /> */}
      <ScrollView>
        {data.getAllPost.map((post) => {
          return (
            <Pressable key={post._id}>
              <View style={styles.card}>
                <Text>{post.content}</Text>
                <Text>{post.tags}</Text>
                <Image source={{ uri: post.imgUrl }} style={styles.image} />
                <Text>{post.authorData[0].username}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
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
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: 350,
    backgroundColor: "gray",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: "cover",
  },
});
