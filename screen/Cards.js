import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { collection, onSnapshot, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const Cards = ({ selectedDate }) => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which item is being edited
  const [editedTitle, setEditedTitle] = useState(''); // Store the edited title
  const navigation = useNavigation();

  useEffect(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'userId'),
      where('selectedDate', '>=', startOfDay.toISOString()),
      where('selectedDate', '<=', endOfDay.toISOString())
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(fetchedData);
    }, (error) => console.error('Error retrieving data:', error));

    return () => unsubscribe();
  }, [selectedDate]);

  const handlePress = (item) => navigation.navigate('TodoModal', { list: item });

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'userId', id));
            console.log('Item deleted successfully');
          } catch (error) {
            console.error('Failed to delete the item');
          }
        }},
      ]
    );
  };

  const handleModify = (item) => {
    setEditingId(item.id); 
    setEditedTitle(item.name); 
  };

  const saveEditedTitle = async (id) => {
    if (!editedTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }

    try {
      await updateDoc(doc(db, 'userId', id), { name: editedTitle });
      setEditingId(null); 
      setEditedTitle(''); 
    } catch (error) {
      console.error('Failed to update the title:', error);
    }
  };

  const renderRightActions = (progress, dragX, item) => (
    <View style={styles.rightActions}>
      <TouchableOpacity
        style={[styles.action, styles.modify]}
        onPress={() => handleModify(item)}
      >
        <MaterialIcons name="create" size={24} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.action, styles.delete]}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: item.color || '#4CAF50' }]}
        onPress={() => handlePress(item)}
      >
        {editingId === item.id ? (
          <TextInput
            style={styles.input}
            value={editedTitle}
            onChangeText={setEditedTitle}
            autoFocus
            onSubmitEditing={() => saveEditedTitle(item.id)}
            onBlur={() => saveEditedTitle(item.id)}
          />
        ) : (
          <Text style={styles.name}>{item.name}</Text>
        )}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    width: '100%',
    textAlign: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 10,
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    borderRadius: 10,
    marginLeft: 5,
  },
  modify: {
    backgroundColor: '#FFC107', 
  },
  delete: {
    backgroundColor: '#F44336', 
  },
});

export default Cards;