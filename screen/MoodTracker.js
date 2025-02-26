import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useState } from 'react';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😁', label: 'Excited' },
  { emoji: '😕', label: 'Confused' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '😮', label: 'Surprised' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '🤩', label: 'Amazed' },
  { emoji: '😇', label: 'Good' },
  { emoji: '🤗', label: 'Hugging' },
];

export default function MoodTracker({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood);
    await addDoc(collection(db, 'moods'), {
      mood,
      timestamp: new Date(),
    });

    navigation.navigate('ChatBot', { mood });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>How are you feeling today?</Text>
      <FlatList
        data={moods}
        keyExtractor={(item) => item.label}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleMoodSelect(item.label)}
            style={styles.moodButton}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.moodLabel}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFC', // Soft light background
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E04F5F', // Reddish pink
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },
  moodButton: {
    margin: 10,
    paddingVertical: 18,
    paddingHorizontal: 25,
    backgroundColor: '#B2E5DB', // Lightened teal (#17B198)
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  emoji: {
    fontSize: 45,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00428c', // Deep Blue for contrast
    textTransform: 'capitalize',
  },
});
