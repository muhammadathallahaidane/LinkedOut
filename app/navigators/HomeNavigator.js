import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#0077b5',
                tabBarInactiveTintColor: '#666666',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 2,
                },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size, focused }) => (
                        <MaterialIcons 
                            name={focused ? "home" : "home"} 
                            size={28} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons 
                            name={focused ? "search" : "search-outline"} 
                            size={26} 
                            color={color} 
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="CreatePostScreen"
                component={CreatePostScreen}
                options={{
                    tabBarLabel: 'Post',
                    tabBarIcon: ({ color, size, focused }) => (
                        <AntDesign 
                            name={focused ? "pluscircle" : "pluscircleo"} 
                            size={24} 
                            color={color} 
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}