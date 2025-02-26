import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { db, auth } from "../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Profile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  // Load user profile from Firebase
  const loadProfile = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      const userDocRef = doc(db, "profiles", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setBio(userData.bio || "");
        setBirthday(userData.birthday ? new Date(userData.birthday) : new Date());
        setPhone(userData.phone || "");

        // Ensure PNG format for DiceBear avatars
        let imageUrl = userData.profileImage || generateAvatarURL(userId);
        if (imageUrl.includes("/svg?")) {
          imageUrl = imageUrl.replace("/svg?", "/png?");
        }

        setProfileImage(imageUrl);
      } else {
        setProfileImage(generateAvatarURL(userId));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate a random avatar URL (PNG version)
  const generateAvatarURL = (userId) => {
    const randomId = Math.floor(Math.random() * 10000);
    return `https://api.dicebear.com/7.x/avataaars/png?seed=${userId || "guest"}-${randomId}&r=${Math.random()}`;
  };

  // Generate & update avatar
  const generateAvatar = () => {
    const userId = auth.currentUser?.uid || "guest";
    const newAvatar = generateAvatarURL(userId);
    setProfileImage(newAvatar);
  };

  // Save user profile to Firebase
  const saveProfile = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not logged in");
      return;
    }

    try {
      await setDoc(doc(db, "profiles", userId), {
        name,
        bio,
        birthday: birthday.toISOString(),
        phone,
        profileImage,
      });
      alert("Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  // Handle date picker change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setBirthday(selectedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* Profile Image or Avatar */}
      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#E04F5F" />
        ) : (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <TouchableOpacity onPress={generateAvatar} style={styles.avatarButton}>
          <Text style={styles.changeText}>Generate New Avatar</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Inputs */}
      <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} editable={isEditing} />
      <TextInput style={styles.input} placeholder="Enter your bio" value={bio} onChangeText={setBio} editable={isEditing} />

      {/* Birthday Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput style={styles.input} placeholder="Select your birthday" value={birthday.toLocaleDateString()} editable={false} />
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={birthday} mode="date" display={Platform.OS === "ios" ? "spinner" : "default"} onChange={onDateChange} />}

      <TextInput style={styles.input} placeholder="Enter your phone number" value={phone} onChangeText={setPhone} editable={isEditing} />

      {/* Save & Edit Buttons */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
        <Text style={styles.editText}>{isEditing ? "Cancel Editing" : "Edit Profile"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#17B198", alignItems: "center" },
  header: { width: "100%", paddingVertical: 20, alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#E04F5F" },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10, borderWidth: 3, borderColor: "#E04F5F" },
  avatarButton: { backgroundColor: "#FFF", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#E04F5F", marginTop: 5 },
  changeText: { color: "#E04F5F", fontSize: 14, fontWeight: "500" },
  input: { 
    width: "90%", padding: 12, borderWidth: 1, borderRadius: 15, marginBottom: 12, backgroundColor: "#FFFFFF", 
    borderColor: "#E04F5F", fontSize: 16, shadowColor: "#888", shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, shadowRadius: 4 
  },
  saveButton: { 
    backgroundColor: "#E04F5F", padding: 14, borderRadius: 15, alignItems: "center", width: "90%", marginTop: 10, 
    shadowColor: "#E04F5F", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 
  },
  saveText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  editButton: { marginTop: 10, backgroundColor: "#FFF", padding: 14, borderRadius: 15, alignItems: "center", width: "90%", borderWidth: 1, borderColor: "#E04F5F" },
  editText: { color: "#E04F5F", fontWeight: "bold", fontSize: 16 },
});
