import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { GET_ALL_POSTS } from "./HomeScreen";

const CREATE_POST = gql`
  mutation CreatePosts($newPost: CreatePostInput) {
    createPosts(newPost: $newPost) {
      _id
      content
      imgUrl
      createdAt
      updatedAt
      comments {
        content
        username
        createdAt
        updatedAt
      }
      authorData {
        name
        username
      }
      likes {
        username
        createdAt
        updatedAt
      }
      tags
    }
  }
`;

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [input, setInput] = useState({
    content: "",
    imgUrl: "",
    tags: [],
  });

  const [createPost, { loading, data, error }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
      },
    ],
    onCompleted: (result) => {
      navigation.navigate("HomeScreen");
    },
  });

  if (loading)
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );

  function handleAdd() {
    createPost({
      variables: {
        newPost: {
          content: input.content,
          imgUrl: input.imgUrl,
          tags: input.tags,
        },
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text>Content</Text>
      <TextInput
        style={styles.input}
        value={input.content}
        onChangeText={(text) => {
          setInput({
            ...input,
            content: text,
          });
        }}
      />
      <Text>Image Url</Text>
      <TextInput
        style={styles.input}
        value={input.imgUrl}
        onChangeText={(text) => {
          setInput({
            ...input,
            imgUrl: text,
          });
        }}
      />

      <Text>Tags</Text>
      <TextInput
        style={styles.input}
        value={input.tags}
        onChangeText={(text) => {
          setInput({
            ...input,
            Tags: text,
          });
        }}
      />

      <Button title="Add" onPress={handleAdd} />
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
