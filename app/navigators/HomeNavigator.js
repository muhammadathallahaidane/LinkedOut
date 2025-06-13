import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CreatePostScreen from '../screens/CreatePostScreen';

const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="SearchScreen"
                component={SearchScreen}
                options={{ headerShown: false }}
            />
            <Tab.Screen
                name="CreatePostScreen"
                component={CreatePostScreen}
                options={{ headerShown: false }}
            />
        </Tab.Navigator>
    )
}