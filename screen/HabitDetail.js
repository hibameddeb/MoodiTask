import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Button, Alert } from "react-native";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const HabitDetail = ({ route, navigation }) => {
  const { habitId } = route.params; 
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request permission for notifications
  useEffect(() => {
    const requestPermissions = async () => {
      if (Device.isDevice) {
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          const { status: newStatus } = await Notifications.requestPermissionsAsync();
          if (newStatus !== "granted") {
            Alert.alert("Permission required", "Please enable notifications in settings.");
          }
        }
      }
    };
    requestPermissions();
  }, []);

  // Fetch habit details
  useEffect(() => {
    const fetchHabitDetails = async () => {
      try {
        const habitDoc = await getDoc(doc(db, "habits", habitId));
        if (habitDoc.exists()) {
          setHabit(habitDoc.data());
        } else {
          console.error("Habit not found");
        }
      } catch (error) {
        console.error("Error fetching habit:", error);
      }
      setLoading(false);
    };
    fetchHabitDetails();
  }, [habitId]);

  // Function to schedule notification
  const scheduleNotification = async () => {
    if (!habit || !habit.reminder) {
      Alert.alert("No reminder set", "Please set a reminder for this habit.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Habit Reminder ⏰",
        body: `Don't forget to complete your habit: ${habit.title}!`,
        sound: "default",
      },
      trigger: new Date(habit.reminder.toDate()), // Schedule based on Firebase timestamp
    });

    Alert.alert("Reminder Set", "You will receive a notification at the set time.");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e04f5f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </Pressable>

      <Text style={styles.title}>Habit Details</Text>

      {habit ? (
        <View style={styles.card}>
          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              <Ionicons name="pencil" size={20} color="#e04f5f" /> Title
            </Text>
            <Text style={styles.detailValue}>{habit.title}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              <MaterialIcons name="category" size={20} color="#e04f5f" /> Category
            </Text>
            <Text style={styles.detailValue}>{habit.category || "No category"}</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              <Feather name="clock" size={20} color="#e04f5f" /> Reminder
            </Text>
            <Text style={styles.detailValue}>
              {habit.reminder ? new Date(habit.reminder.toDate()).toLocaleString() : "No reminder set"}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.detailContainer}>
            <Text style={styles.detailTitle}>
              <Feather name="repeat" size={20} color="#e04f5f" /> Repeat
            </Text>
            <Text style={styles.detailValue}>{habit.repeat}</Text>
          </View>

          <Button title="Set Notification Reminder" onPress={scheduleNotification} color="#e04f5f" />
        </View>
      ) : (
        <Text style={styles.errorText}>Habit not found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#e04f5f",
    padding: 10,
    borderRadius: 50,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e04f5f",
    marginVertical: 20,
    textAlign: "center",
    marginTop: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginTop: 40,
  },
  detailContainer: {
    marginBottom: 15,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 18,
    color: "#222",
    marginTop: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default HabitDetail;
