import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileHeader = ({ user, onUpdateUser }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user.username);

  const handleSaveProfile = () => {
    if (!editedUsername.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    onUpdateUser({
      ...user,
      username: editedUsername.trim(),
    });

    setIsEditModalVisible(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleEditAvatar = () => {
    Alert.alert("Edit Avatar", "Avatar editing functionality would go here");
    // TODO: Integrate image picker to change avatar
  };

  return (
    <View>
      {/* Profile Info Section */}
      <View style={styles.profileSection}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.profilePic }} style={styles.avatar} />
          <TouchableOpacity
            style={styles.avatarEditButton}
            onPress={handleEditAvatar}
          >
            <MaterialIcons name="image" color={"#fff"} size={16} />
          </TouchableOpacity>
        </View>

        {/* Post Count */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.postsCount}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          {/* Edit Username Button */}
          <TouchableOpacity
            style={styles.usernameEditButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <MaterialIcons name="edit" color={"#fff"} size={12} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={editedUsername}
              onChangeText={setEditedUsername}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    left: "18%",
    backgroundColor: "#6200EA",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 16,
    flexDirection: "row",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  usernameEditButton: {
    backgroundColor: "#6200EA",
    padding: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#6200EA",
  },
  cancelButtonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ProfileHeader;
