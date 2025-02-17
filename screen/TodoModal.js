import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, Feather } from '@expo/vector-icons';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebaseConfig';

const TodoModal = ({ route }) => {
  const navigation = useNavigation();
  const { list } = route.params;
  const [newCard, setNewCard] = useState('');
  const [cards, setCards] = useState(list.cards || []);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'userId', list.id), (doc) => {
      if (doc.exists()) {
        setCards(doc.data().cards || []);
      }
    });
    return unsubscribe;
  }, [list.id]);

  const toggleTodoComplete = async (index) => {
    const updatedCards = [...cards];
    updatedCards[index].completed = !updatedCards[index].completed;
    await updateDoc(doc(db, 'userId', list.id), { cards: updatedCards });
  };

  const updateTodo = async (index) => {
    const updatedCards = [...cards];
    updatedCards[index].title = editText;
    await updateDoc(doc(db, 'userId', list.id), { cards: updatedCards });
    setEditIndex(null);
    setEditText('');
  };

  const addTodo = async () => {
    if (!newCard.trim()) return;
    await updateDoc(doc(db, 'userId', list.id), {
      cards: arrayUnion({ title: newCard, completed: false })
    });
    setNewCard('');
  };

  const renderCards = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => toggleTodoComplete(index)}>
        <Ionicons name={item.completed ? 'checkbox' : 'square-outline'} size={24} color={item.completed ? '#54b367' : '#615c5c'} />
      </TouchableOpacity>
      {editIndex === index ? (
        <TextInput
          style={styles.input}
          value={editText}
          onChangeText={setEditText}
          onSubmitEditing={() => updateTodo(index)}
          autoFocus
        />
      ) : (
        <TouchableOpacity>
          <Text style={[styles.todo, { textDecorationLine: item.completed ? 'line-through' : 'none' }]}>{item.title}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => {
        setEditIndex(index);
        setEditText(item.title);
      }}>
        <Feather name="edit" size={20} color="#4A90E2" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <AntDesign name="close" size={25} color="#000" />
        </TouchableOpacity>

        <View style={[styles.header, { borderBottomColor: list.color }]}>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.taskCount}>{(cards || []).filter(c => c.completed).length} of {cards.length} tasks</Text>
        </View>

        <FlatList data={cards} renderItem={renderCards} keyExtractor={(item, index) => index.toString()} />

         <View style={styles.footer}>
          <TextInput style={styles.input} placeholder="Add a task..." value={newCard} onChangeText={setNewCard} />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: list.color }]} onPress={addTodo} activeOpacity={0.7}>
            <AntDesign name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { margin: 20, borderBottomWidth: 2 },
  title: { fontSize: 30, fontWeight: '800' },
  taskCount: { fontSize: 14, marginVertical: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', margin: 20 },
  input: { flex: 1, height: 48, borderWidth: 1, borderRadius: 6, marginRight: 8, paddingHorizontal: 8 },
  addButton: { padding: 16, borderRadius: 4 },
  closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  cardContainer: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  todo: { fontSize: 16, marginLeft: 10 },
});
export default TodoModal;
