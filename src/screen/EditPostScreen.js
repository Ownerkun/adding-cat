import React from "react";
import { View, StyleSheet } from "react-native";
import EditPost from "../components/EditPost";

const EditPostScreen = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <EditPost route={route} navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditPostScreen;
