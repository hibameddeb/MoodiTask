import { Ionicons, AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; 
import DateTimePicker from '@react-native-community/datetimepicker';

const categories = [
  { label: 'Health', value: 'Health' },
  { label: 'Education', value: 'Education' },
  { label: 'Leisure', value: 'Leisure' },
  { label: 'Work', value: 'Work' },
  { label: 'Personal', value: 'Personal' },
];

const daysOfWeek = ["M", "Tu", "W", "Th", "F", "Sat", "Sun"];

const Create = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [repeat, setRepeat] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [category, setCategory] = useState(null);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRepeatSelection = (label) => {
    setRepeat(label);
    if (label === "Weekly" || label === "Monthly") {
      setSelectedDays([]); // Reset days when switching to Weekly or Monthly
    }
  };

  const handleDaySelect = (day) => {
    if (repeat !== "Daily") return; // Only allow selection for Daily
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((item) => item !== day) : [...prev, day]
    );
  };

  const createHabit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a habit title!");
      return;
    }
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const habitRef = collection(db, "habits");
      await addDoc(habitRef, {
        title,
        repeat,
        days: selectedDays,
        category,
        reminder: reminderDate,
        createdAt: new Date(),
        userId: user.uid,
        completed:false
      });

      setLoading(false);
      navigation.goBack();
      Alert.alert("Success", "Habit created successfully!");
    } catch (error) {
      console.error("Error creating habit:", error);
      Alert.alert("Error", "Failed to create habit. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <Text style={styles.title}>Create <Text style={styles.boldText}>Habit</Text></Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      {/* Repeat Selection */}
      <Text style={styles.sectionTitle}>Repeat</Text>
      <View style={styles.repeatContainer}>
        {["Daily", "Weekly", "Monthly"].map((label) => (
          <Pressable
            key={label}
            onPress={() => handleRepeatSelection(label)}
            style={[styles.repeatButton, repeat === label && styles.selectedButton]}
          >
            <Text style={styles.textCenter}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Show Days for Daily */}
      {repeat === "Daily" && (
        <>
          <Text style={styles.sectionTitle}>On These Days</Text>
          <View style={styles.daysContainer}>
            {daysOfWeek.map((day) => (
              <Pressable
                key={day}
                onPress={() => handleDaySelect(day)}
                style={[styles.dayButton, selectedDays.includes(day) && styles.selectedDay]}
              >
                <Text>{day}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {/* Show Date Selection for Weekly & Monthly */}
      {(repeat === "Weekly" || repeat === "Monthly") && (
        <>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.reminderButton}>
            <Text style={styles.reminderText}>{reminderDate.toLocaleDateString()}</Text>
          </Pressable>
        </>
      )}

      {showDatePicker && (repeat === "Weekly" || repeat === "Monthly") && (
        <DateTimePicker
          value={reminderDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (event?.type !== 'dismissed') {
              setReminderDate(selectedDate || reminderDate);
            }
            setShowDatePicker(false);
          }}
        />
      )}


      {/* Reminder Time Selection */}
      <Text style={styles.sectionTitle}>Reminder Time</Text>
      <Pressable onPress={() => setShowTimePicker(true)} style={styles.reminderButton}>
        <Text style={styles.reminderText}>{reminderDate.toLocaleTimeString()}</Text>
      </Pressable>

      {showTimePicker && (
        <DateTimePicker
          value={reminderDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            if (event?.type !== 'dismissed') {
              setReminderDate(selectedTime || reminderDate);
            }
            setShowTimePicker(false);
          }}
        />
      )}

      {/* Category Selection */}
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        data={categories}
        labelField="label"
        valueField="value"
        placeholder="Select category"
        value={category}
        onChange={(item) => setCategory(item.value)}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />

      {/* Save Button */}
      <Pressable
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={createHabit}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>{loading ? "Saving..." : "Save"}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F5F7FA", // Light background for contrast
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    backgroundColor: "#17B198", // Teal Green Back Button
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E04F5F", // Coral Red Title
    marginVertical: 10,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "800",
  },
  input: {
    width: "95%",
    padding: 0,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderColor: "#17B198",
    borderWidth: 2,
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E04F5F",
    marginTop: 20,
  },
  repeatContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  repeatButton: {
    backgroundColor: "#17B198", // Teal buttons
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    elevation: 3, // Shadow for buttons
  },
  selectedButton: {
    backgroundColor: "#E04F5F", // Highlight selected button in Coral Red
  },
  textCenter: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dayButton: {
    width: "14%",
    height: 40,
    borderRadius: 50,
    backgroundColor: "#E1EBEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 1,
  },
  selectedDay: {
    backgroundColor: "#17B198", // Selected day color in teal green
  },
  reminderButton: {
    backgroundColor: "#E1EBEE",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#17B198",
  },
  reminderText: {
    fontSize: 16,
    color: "#E04F5F",
    fontWeight: "600",
  },
  dropdown: {
    marginTop: 20,
    height: 50,
    borderColor: "#E04F5F",
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#B1B1B1",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#E04F5F",
  },
  saveButton: {
    marginTop: 25,
    backgroundColor: "#E04F5F", // Coral Red Save Button
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#17B198", // Teal green for disabled state
    opacity: 0.5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});




export default Create;
