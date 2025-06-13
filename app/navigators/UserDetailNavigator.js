import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserDetailScreen from "../screens/UserDetailScreen";
import PostDetailScreen from "../screens/PostDetailScreen";

const Stack = createNativeStackNavigator();

export default function UserDetailNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserDetailScreen"
        component={UserDetailScreen}
        options={({ route }) => ({
          title: route.params?.name || "User Profile", // Dynamic title from params
          headerShown: true,
        })}
      />
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={({ route }) => ({
          title: "Post Detail", // Dynamic title from params
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
