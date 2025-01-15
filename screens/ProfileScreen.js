import React from "react";
import { View, Text, StyleSheet, Button, Image } from "react-native";

const ProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "" }} // Replace with actual image URL
        style={styles.profileImage}
      />
      <Text style={styles.name}></Text>
      <Text style={styles.email}></Text>
      <Button
        title="Edit Profile"
        onPress={() => navigation.navigate("EditProfile")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
    color: "gray",
  },
});

export default ProfileScreen;
