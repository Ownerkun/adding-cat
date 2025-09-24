// import { AuthProvider } frome "./src/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/screen/HomeScreen";
import { AuthProvider } from "./src/AuthContext";
import { PostProvider } from "./src/PostContext";

export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <View style={styles.container}>
          <AppNavigator />
        </View>
      </PostProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
