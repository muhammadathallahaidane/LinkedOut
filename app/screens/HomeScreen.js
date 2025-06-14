import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import {
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AuthContext from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import { gql, useQuery, useMutation } from "@apollo/client";

export const GET_ALL_POSTS = gql`
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

const ADD_LIKE = gql`
  mutation AddLike($postId: ID) {
    addLike(postId: $postId)
  }
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  
  const { loading, data, error, refetch } = useQuery(GET_ALL_POSTS, {
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

const [addLike] = useMutation(ADD_LIKE, {
  refetchQueries: [
    { query: GET_ALL_POSTS }
  ],
  onError: (error) => {
    Alert.alert("Error", error.message);
  },
});

  // Handle loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading posts...</Text>
      </SafeAreaView>
    );
  }

  // Handle error state
  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>Error loading posts</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </SafeAreaView>
    );
  }

  // Handle no data
  if (!data || !data.getAllPost) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>No posts available</Text>
      </SafeAreaView>
    );
  }

  async function handleLogout() {
    await SecureStore.deleteItemAsync("access_token");
    authContext.setIsLoggedIn(false);
  }

  const formatTime = (dateString) => {
    if (!dateString) {
      return "now";
    }

    let date;
    
    // Handle Unix timestamp (string of numbers)
    if (/^\d+$/.test(dateString.toString())) {
      const timestamp = parseInt(dateString);
      // Check if it's in seconds (10 digits) or milliseconds (13 digits)
      if (timestamp.toString().length === 10) {
        // Unix timestamp in seconds, convert to milliseconds
        date = new Date(timestamp * 1000);
      } else {
        // Already in milliseconds
        date = new Date(timestamp);
      }
    } else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      return "now";
    }

    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (diff < 0) {
      return "now";
    }
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return "now";
  };

  const renderPost = (post) => {
    const author = post.authorData[0];
    const authorName = author?.name || author?.username || "Unknown";
    const likesCount = post.likes?.length || 0;
    const commentsCount = post.comments?.length || 0;

    const handlePostPress = () => {
      navigation.navigate('UserDetailNavigator', {
        screen: 'PostDetailScreen',
        params: {
          postId: post._id,
          postTitle: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '')
        }
      });
    };

    const handleLikePress = (event) => {
      event.stopPropagation(); // Prevent triggering post card press
      // Add like - server will handle duplicate prevention
      addLike({ variables: { postId: post._id } });
    };

    return (
      <TouchableOpacity key={post._id} style={styles.postCard} onPress={handlePostPress} activeOpacity={0.9}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            {/* Author Details */}
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{authorName}</Text>
              <Text style={styles.authorUsername}>@{author?.username}</Text>
              <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
            </View>
          </View>
            {/* More Options */}
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          <Text style={styles.contentText}>{post.content}</Text>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {(Array.isArray(post.tags) ? post.tags : [post.tags]).map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Post Image */}
        {post.imgUrl && (
          <Image source={{ uri: post.imgUrl }} style={styles.postImage} />
        )}

        {/* Engagement Stats */}
        <View style={styles.engagementStats}>
          <Text style={styles.statsText}>
            {likesCount > 0 && commentsCount > 0 
              ? `${likesCount} likes • ${commentsCount} comments`
              : likesCount > 0 
                ? `${likesCount} likes`
                : commentsCount > 0 
                  ? `${commentsCount} comments`
                  : ''
            }
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLikePress}
            activeOpacity={0.7}
          >
            <MaterialIcons name="thumb-up" size={18} color="#666" />
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="comment" size={18} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="share" size={18} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LinkedOut</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts Feed */}
      <ScrollView 
        style={styles.feed}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
      >
        {/* Create Post Card */}
        <View style={styles.createPostCard}>
          <View style={styles.createPostInput}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>Y</Text>
            </View>
            <Text style={styles.createPostText}>Start a post...</Text>
          </View>

          <View style={styles.createPostActions}>
            <TouchableOpacity style={styles.createAction}>
              <MaterialIcons name="photo-camera" size={20} color="#666" />
              <Text style={styles.createActionText}>Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createAction}>
              <MaterialIcons name="videocam" size={20} color="#666" />
              <Text style={styles.createActionText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createAction}>
              <MaterialIcons name="article" size={20} color="#666" />
              <Text style={styles.createActionText}>Article</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts */}
        {data.getAllPost.map(renderPost)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f2ef",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f2ef",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  
  // Header Styles
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077b5",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchButton: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 20,
  },
  messageButton: {
    padding: 8,
  },
  messageIcon: {
    fontSize: 20,
  },
  logoutButton: {
    backgroundColor: "#0077b5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  logoutText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  // Feed Styles
  feed: {
    flex: 1,
  },
  feedContainer: {
    paddingVertical: 8,
  },

  // Create Post Card
  createPostCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  createPostInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  createPostText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  createPostActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  createAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  createActionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginLeft: 6,
  },

  // Post Card Styles
  postCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  authorUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 4,
  },

  // Post Content
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  contentText: {
    fontSize: 15,
    lineHeight: 20,
    color: "#000",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    fontSize: 14,
    color: "#0077b5",
    fontWeight: "500",
  },
  postImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },

  // Engagement
  engagementStats: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statsText: {
    fontSize: 13,
    color: "#666",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginLeft: 6,
  },
});