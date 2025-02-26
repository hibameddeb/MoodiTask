import React, { useState, useEffect, useCallback } from 'react';
import { View, Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db, collection, getDocs, query, where, updateDoc, doc, auth } from '../firebaseConfig';
import { Checkbox } from 'react-native-paper';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [option, setOption] = useState("Daily");
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  const fetchHabits = async () => {
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    try {
      const q = query(collection(db, 'habits'), where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const habitsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHabits(habitsData);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [currentUser])
  );

  const filteredHabits = habits.filter(habit => habit.repeat === option);

  const handleCheck = async (habitId, isChecked) => {
    try {
      const habitDocRef = doc(db, "habits", habitId);
      await updateDoc(habitDocRef, { completed: isChecked });
  
      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === habitId ? { ...habit, completed: isChecked } : habit
        )
      );
    } catch (error) {
      console.error("Error updating habit status:", error);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.addButtonContainer}>
        <Pressable onPress={() => navigation.navigate("Create")} style={styles.addButton}>
          <AntDesign name="plus" size={24} color="#fff" />
        </Pressable>
      </View>

      <Text style={styles.title}>My Habits</Text>

      <View style={styles.optionContainer}>
        {["Daily", "Weekly", "Monthly"].map((type) => (
          <Pressable key={type} onPress={() => setOption(type)} style={[styles.optionButton, option === type && styles.selectedOption]}>
            <Text style={[styles.optionText, option === type && styles.selectedOptionText]}>{type}</Text>
          </Pressable>
        ))}
      </View>

      {filteredHabits.length > 0 ? (
        filteredHabits.map((habit) => (
          <View key={habit.id} style={styles.habitContainer}>
            <Pressable style={styles.habitInfo} onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })}>
              <Text style={styles.habitTitle}>{habit.title}</Text>
            </Pressable>
            <Checkbox.Android
              status={habit.completed ? 'checked' : 'unchecked'}
              onPress={() => handleCheck(habit.id, !habit.completed)}
              color="#E04F5F"
            />
          </View>
        ))
      ) : (
        <Text style={styles.noHabitsText}>No {option} Habits</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7", padding: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#E04F5F", marginBottom: 20, textAlign: 'center' },
  optionContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  optionButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: "#FFE6E8", marginHorizontal: 10, borderWidth: 1, borderColor: "#E04F5F" },
  selectedOption: { backgroundColor: "#E04F5F", borderColor: "#E04F5F" },
  optionText: { fontSize: 16, color: "#E04F5F", fontWeight: "600" },
  selectedOptionText: { color: "#fff" },
  habitContainer: { marginVertical: 12, padding: 15, backgroundColor: '#fff', borderRadius: 12, flexDirection: "row", alignItems: "center", shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  habitInfo: { flex: 1, marginRight: 20 },
  habitTitle: { fontSize: 16, fontWeight: '600', color: "#333", flexWrap: 'wrap', maxWidth: '80%' },
  noHabitsText: { fontSize: 14, textAlign: 'center', marginTop: 20, color: "#b2bec3" },
  addButtonContainer: { position: 'absolute', right: 2, zIndex: 1 },
  addButton: { backgroundColor: "#E04F5F", padding: 8, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }
});

export default Habits;