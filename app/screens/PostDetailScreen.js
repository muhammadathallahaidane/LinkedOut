import { gql, useQuery } from "@apollo/client";
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Alert,
  FlatList
} from "react-native";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const GET_POST = gql`
  query GetPost($getPostId: ID) {
    getPost(id: $getPostId) {
      _id
      authorData {
        name
        username
        _id
      }
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
      content
      createdAt
      imgUrl
      tags
      updatedAt
    }
  }
`;

export default function PostDetailScreen({ route }) {
  const { postId, postTitle } = route.params;
  const authContext = useContext(AuthContext);

  const { loading, data, error } = useQuery(GET_POST, {
    variables: {
      getPostId: postId
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    }
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading post...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading post</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </SafeAreaView>
    );
  }  const post = data?.getPost;
  
  if (!post) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Post not found</Text>
      </SafeAreaView>
    );
  }

  // Handle both array and object format for authorData
  const author = Array.isArray(post.authorData) ? post.authorData[0] : post.authorData;
  const authorName = author?.name || author?.username || "Unknown";
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const formatTime = (dateString) => {
    if (!dateString) {
      return "now";
    }    let date;
      // Handle Unix timestamp (string of numbers)
    if (/^\d+$/.test(dateString)) {
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
    }    const now = new Date();
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

  const renderComment = ({ item }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>@{item.username}</Text>
          <Text style={styles.commentTime}>{formatTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {authorName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{authorName}</Text>
              <Text style={styles.authorUsername}>@{author?.username}</Text>
              <Text style={styles.postTime}>{formatTime(post.createdAt)}</Text>
            </View>
          </View>
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
            {likesCount > 0 && `${likesCount} likes`}
            {likesCount > 0 && commentsCount > 0 && " • "}
            {commentsCount > 0 && `${commentsCount} comments`}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👍</Text>
            <Text style={styles.actionText}>Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments ({commentsCount})</Text>
          {post.comments && post.comments.length > 0 ? (
            <FlatList
              data={post.comments}
              renderItem={renderComment}
              keyExtractor={(item, index) => `${item.username}-${index}`}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.emptyText}>No comments yet</Text>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f2ef",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#d93025",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  postHeader: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  authorUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  postContent: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000",
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    fontSize: 14,
    color: "#0077b5",
    fontWeight: "500",
  },
  postImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  engagementStats: {
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statsText: {
    fontSize: 13,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  commentsSection: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  commentAvatarText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0077b5",
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    color: "#999",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
