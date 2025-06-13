import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
  Alert,
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import AuthContext from "../contexts/AuthContext";
import { gql, useLazyQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";

const SEARCH = gql`
  query Search($keyword: String) {
    search(keyword: $keyword) {
      _id
      email
      name
      username
      followers {
        _id
        name
        username
        email
      }
      followings {
        _id
        name
        username
        email
      }
    }
  }
`;

export default function SearchScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [searchQuery, { loading, data, error }] = useLazyQuery(SEARCH, {
    onCompleted: (result) => {
      setSearchResults(result.search || []);
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      searchQuery({
        variables: {
          keyword: searchKeyword.trim(),
        },
      });
    } else {
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
  };
  async function handleLogout() {
    await SecureStore.deleteItemAsync("access_token");
    authContext.setIsLoggedIn(false);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search People</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for people..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <View style={styles.searchButtons}>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>
              {loading ? "Searching..." : "Search"}
            </Text>
          </TouchableOpacity>
          
          {searchKeyword.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchResults.length > 0 ? (
          <>
            <Text style={styles.resultsHeader}>
              {searchResults.length} people found
            </Text>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            >
              {searchResults.map((item) => (
                <TouchableOpacity key={item._id} style={styles.userCard}>
                  <View style={styles.avatarContainer}>
                    {/* Placeholder avatar - bisa diganti dengan gambar user */}
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {item.name ? item.name.charAt(0).toUpperCase() : item.username.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name || item.username}</Text>
                    <Text style={styles.userUsername}>@{item.username}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    
                    <View style={styles.statsContainer}>
                      <Text style={styles.stats}>
                        {item.followers?.length || 0} followers • {item.followings?.length || 0} following
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.connectButton}>
                    <Text style={styles.connectButtonText}>Connect</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        ) : searchKeyword.length > 0 && !loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try searching with different keywords
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Start searching</Text>
            <Text style={styles.emptyStateSubtext}>
              Enter a name or username to find people
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0077b5", // LinkedIn blue
    paddingTop: 50, // For status bar
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f8f8f8",
    marginBottom: 15,
  },
  searchButtons: {
    flexDirection: "row",
    gap: 10,
  },
  searchButton: {
    backgroundColor: "#0077b5",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  clearButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0077b5",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
    color: "#0077b5",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  statsContainer: {
    marginTop: 4,
  },
  stats: {
    fontSize: 12,
    color: "#888",
  },
  connectButton: {
    backgroundColor: "#0077b5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  connectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});