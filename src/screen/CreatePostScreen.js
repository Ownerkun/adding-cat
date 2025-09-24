import React from "react";
import CreatePost from "../components/CreatePost";
import { View, StyleSheet } from "react-native";

const CreatePostScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CreatePost navigation={navigation} />;
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
});

export default CreatePostScreen;
