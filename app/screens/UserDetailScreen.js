import { gql, useQuery, useMutation } from "@apollo/client";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  FlatList,
} from "react-native";
import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const GET_USER_DETAILS = gql`
  query GetUser($getUserId: ID) {
    getUser(id: $getUserId) {
      _id
      email
      name
      username
      followers {
        _id
        email
        name
        username
      }
      followings {
        _id
        email
        name
        username
      }
    }
  }
`;

const FOLLOW_USER = gql`
  mutation FollowUser($payload: CreateFollow) {
    followUser(payload: $payload)
  }
`;

export default function UserDetailScreen({ route }) {
  const { id, name, username, email } = route.params;
  const [activeTab, setActiveTab] = useState("followers"); // 'followers', 'following'
  const authContext = useContext(AuthContext);

  const { loading, data, error, refetch } = useQuery(GET_USER_DETAILS, {
    variables: {
      getUserId: id,
    },
  });

  const [followUser, { loading: followLoading }] = useMutation(FOLLOW_USER, {
    onCompleted: () => {
      Alert.alert("Success", "User followed successfully!");
      refetch(); // Refresh user data to update followers count
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading profile</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
      </SafeAreaView>
    );
  }
  const user = data?.getUser;
  const displayName = user?.name || name || username;
  const displayUsername = user?.username || username;
  const displayEmail = user?.email || email;
  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.followings?.length || 0;

  const handleFollowPress = () => {
    if (followLoading) return;

    followUser({
      variables: {
        payload: {
          followingId: id,
        },
      },
    });
  };

  const renderFollowerItem = ({ item }) => (
    <View style={styles.followerItem}>
      <View style={styles.followerAvatar}>
        <Text style={styles.followerAvatarText}>
          {item.name
            ? item.name.charAt(0).toUpperCase()
            : item.username.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.followerInfo}>
        <Text style={styles.followerName}>{item.name || item.username}</Text>
        <Text style={styles.followerUsername}>@{item.username}</Text>
        <Text style={styles.followerEmail}>{item.email}</Text>
      </View>
    </View>
  );
  const renderTabContent = () => {
    switch (activeTab) {
      case "followers":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Followers ({followersCount})
            </Text>
            {user?.followers?.length > 0 ? (
              <FlatList
                data={user.followers}
                renderItem={renderFollowerItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No followers yet</Text>
            )}
          </View>
        );
      case "following":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Following ({followingCount})
            </Text>
            {user?.followings?.length > 0 ? (
              <FlatList
                data={user.followings}
                renderItem={renderFollowerItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>Not following anyone yet</Text>
            )}
          </View>
        );
      default:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Followers ({followersCount})
            </Text>
            {user?.followers?.length > 0 ? (
              <FlatList
                data={user.followers}
                renderItem={renderFollowerItem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>No followers yet</Text>
            )}
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverPhoto}>
          <View style={styles.coverGradient} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          {/* Profile Photo */}
          <View style={styles.profilePhotoContainer}>
            <View style={styles.profilePhoto}>
              <Text style={styles.profilePhotoText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userTitle}>@{displayUsername}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
            {/* Stats */}
            <View style={styles.statsContainer}>
              <TouchableOpacity
                style={styles.stat}
                onPress={() => setActiveTab("followers")}
              >
                <Text style={styles.statNumber}>{followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </TouchableOpacity>
              <View style={styles.statDivider} />
              <TouchableOpacity
                style={styles.stat}
                onPress={() => setActiveTab("following")}
              >
                <Text style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </TouchableOpacity>
            </View>
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleFollowPress}
                disabled={followLoading}
              >
                <Text style={styles.connectButtonText}>
                  {followLoading ? "Loading..." : "Follow"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "followers" && styles.activeTab]}
            onPress={() => setActiveTab("followers")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "followers" && styles.activeTabText,
              ]}
            >
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "following" && styles.activeTab]}
            onPress={() => setActiveTab("following")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "following" && styles.activeTabText,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

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
  coverPhoto: {
    height: 120,
    backgroundColor: "#0077b5",
    position: "relative",
  },
  coverGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 119, 181, 0.8)",
  },
  profileSection: {
    backgroundColor: "white",
    paddingBottom: 20,
    marginBottom: 8,
    position: "relative",
  },
  profilePhotoContainer: {
    position: "absolute",
    top: -40,
    left: 20,
    zIndex: 1,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePhotoText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  userInfo: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  userTitle: {
    fontSize: 16,
    color: "#0077b5",
    marginBottom: 4,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  connectButton: {
    flex: 1,
    backgroundColor: "#0077b5",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  connectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "transparent",
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0077b5",
  },
  messageButtonText: {
    color: "#0077b5",
    fontSize: 16,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0077b5",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#0077b5",
    fontWeight: "600",
  },
  followerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  followerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  followerAvatarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  followerInfo: {
    flex: 1,
  },
  followerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  followerUsername: {
    fontSize: 14,
    color: "#0077b5",
    marginBottom: 2,
  },
  followerEmail: {
    fontSize: 12,
    color: "#666",
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  section: {
    backgroundColor: "white",
    marginBottom: 8,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
