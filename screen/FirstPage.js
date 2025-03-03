import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getDoc, doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth"; 
import { db, auth } from "../firebaseConfig"; 
import Home from "./Home";
import Habits from "./Habits";
import MoodTracker from "./MoodTracker";
import Profile from "./Profile";

const CustomDrawerContent = ({ navigation }) => {
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in.");
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "profiles", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserName(data.name || "User");

        let imageUrl = data.profileImage || "https://api.dicebear.com/7.x/avataaars/png?seed=DefaultUser";
        if (imageUrl.includes("/svg?")) {
          imageUrl = imageUrl.replace("/svg?", "/png?");
        }

        setProfileImage(imageUrl);
      } else {
        console.log("No user profile found.");
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace("Login"); 
            } catch (error) {
              console.error("Sign out error:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.menuContainer}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#17b198" />
        ) : (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <Text style={styles.profileName}>Hello, {userName}!</Text>
      </View>

      <View style={styles.divider} />

      {/* Menu Items */}
      <Pressable style={styles.menuItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={22} color="#17b198" />
        <Text style={styles.menuText}>Home</Text>
      </Pressable>

      <Pressable style={styles.menuItem} onPress={() => navigation.navigate("Habits")}>
        <MaterialCommunityIcons name="calendar-check" size={22} color="#17b198" />
        <Text style={styles.menuText}>Habits</Text>
      </Pressable>

      <Pressable style={styles.menuItem} onPress={() => navigation.navigate("MoodTracker")}>
        <MaterialCommunityIcons name="emoticon-happy" size={22} color="#17b198" />
        <Text style={styles.menuText}>Mood Tracker</Text>
      </Pressable>

      <Pressable style={styles.menuItem} onPress={() => navigation.navigate("Profile")}>
        <Ionicons name="person" size={22} color="#17b198" />
        <Text style={styles.menuText}>Profile</Text>
      </Pressable>

      <View style={styles.divider} />

      {/* Sign Out Button */}
      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={22} color="white" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </View>
  );
};

const Drawer = createDrawerNavigator();

export default function FirstPage() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: { backgroundColor: "#fff", width: 250 },
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Habits" component={Habits} />
      <Drawer.Screen name="MoodTracker" component={MoodTracker} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#17b198",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  menuText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#17b198",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  signOutText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginLeft: 10,
  },
});
