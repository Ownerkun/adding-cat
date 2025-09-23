import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PostCard from "../components/PostCard";

const HomeScreen = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
});

export default HomeScreen;
