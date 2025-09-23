// import { AuthProvider } frome "./src/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { View, StyleSheet } from "react-native";
import HomeScreen from "./src/screen/HomeScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
