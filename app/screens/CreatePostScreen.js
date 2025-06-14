import { gql, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext } from "react";
import {
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AuthContext from "../contexts/AuthContext";
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
  const authContext = useContext(AuthContext);
  const [input, setInput] = useState({
    content: "",
    imgUrl: "",
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState("");  const [createPost, { loading }] = useMutation(CREATE_POST, {
    refetchQueries: [
      {
        query: GET_ALL_POSTS,
      },
    ],
    onCompleted: (result) => {
      // Reset form input setelah berhasil post
      setInput({
        content: "",
        imgUrl: "",
        tags: [],
      });
      setCurrentTag("");
      
      Alert.alert("Success", "Post created successfully!");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });
  const handlePost = () => {
    if (!input.content.trim()) {
      Alert.alert("Error", "Please write something to post");
      return;
    }

    createPost({
      variables: {
        newPost: {
          content: input.content.trim(),
          imgUrl: input.imgUrl.trim() || null,
          tags: input.tags,
        },
      },
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const isPostDisabled = !input.content.trim() || loading;

  const addTag = () => {
    if (currentTag.trim() && !input.tags.includes(currentTag.trim())) {
      setInput({
        ...input,
        tags: [...input.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setInput({
      ...input,
      tags: input.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleTagInputSubmit = () => {
    addTag();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create post</Text>
            <TouchableOpacity
              onPress={handlePost}
              style={[
                styles.postButton,
                isPostDisabled && styles.postButtonDisabled,
              ]}
              disabled={isPostDisabled}
            >
              <Text
                style={[
                  styles.postButtonText,
                  isPostDisabled && styles.postButtonTextDisabled,
                ]}
              >
                {loading ? "Posting..." : "Post"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Author Info */}
            <View style={styles.authorSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Y</Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>You</Text>
                <Text style={styles.visibility}>🌍 Anyone</Text>
              </View>
            </View>

            {/* Post Content Input */}
            <View style={styles.inputSection}>
              <TextInput
                style={styles.contentInput}
                multiline
                placeholder="What do you want to talk about?"
                placeholderTextColor="#666"
                value={input.content}
                onChangeText={(text) => {
                  setInput({
                    ...input,
                    content: text,
                  });
                }}
                textAlignVertical="top"
                maxLength={3000}
              />
            </View>

            {/* Media Section */}
            <View style={styles.mediaSection}>
              <Text style={styles.sectionLabel}>Add media (optional)</Text>
              <TextInput
                style={styles.mediaInput}
                placeholder="Paste image URL here..."
                placeholderTextColor="#999"
                value={input.imgUrl}
                onChangeText={(text) => {
                  setInput({
                    ...input,
                    imgUrl: text,
                  });
                }}
              />
            </View>

            {/* Tags Section */}
            <View style={styles.tagsSection}>
              <Text style={styles.sectionLabel}>Add hashtags (optional)</Text>
              <View style={styles.tagsInputContainer}>
                <TextInput
                  style={styles.tagsInput}
                  placeholder="e.g. technology, innovation, career"
                  placeholderTextColor="#999"
                  value={currentTag}
                  onChangeText={(text) => {
                    setCurrentTag(text);
                  }}
                  onSubmitEditing={handleTagInputSubmit}
                />
                <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
                  <Text style={styles.addTagButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.selectedTags}>
                {input.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity
                      onPress={() => removeTag(tag)}
                      style={styles.removeTagButton}
                    >
                      <Text style={styles.removeTagButtonText}>x</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Bottom Spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f2ef",
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  postButton: {
    backgroundColor: "#0077b5",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  postButtonDisabled: {
    backgroundColor: "#b0b0b0",
  },
  postButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  postButtonTextDisabled: {
    color: "#ccc",
  },
  content: {
    flex: 1,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  visibility: {
    fontSize: 14,
    color: "#666",
  },
  inputSection: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    minHeight: 120,
    textAlignVertical: "top",
  },
  mediaSection: {
    backgroundColor: "white",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  mediaInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#f9f9f9",
  },
  tagsSection: {
    backgroundColor: "white",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  tagsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tagsInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#f9f9f9",
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: "#0077b5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addTagButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  tag: {
    backgroundColor: "#e1f5fe",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tagText: {
    fontSize: 14,
    color: "#0077b5",
    fontWeight: "500",
    marginRight: 4,
  },
  removeTagButton: {
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  removeTagButtonText: {
    color: "#d93025",
    fontSize: 14,
    fontWeight: "600",
  },
  toolsSection: {
    backgroundColor: "white",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  toolsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  tools: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tool: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    flex: 1,
    marginHorizontal: 4,
  },
  toolIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  toolText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  characterCount: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  characterText: {
    fontSize: 12,
    color: "#999",
  },
  characterWarning: {
    color: "#d93025",
  },
  bottomSpacing: {
    height: 20,
  },
});
