// Import the native stack navigator from React Navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import the Login and Signup screen components
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// Create a stack navigator instance
const Stack = createNativeStackNavigator();

// AuthStack component that defines the authentication navigation flow
export default function AuthStack() {
  return (
    // Define the stack navigator container
    <Stack.Navigator>
      {/* Screen for user login */}
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* Screen for user signup */}
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
