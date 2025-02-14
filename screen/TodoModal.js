import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, 
  KeyboardAvoidingView, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebaseConfig';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default class TodoModal extends Component {
  state = {
    newCard: "",
    list: this.props.list || { id: '', cards: [], color: "#808080", name: "Unnamed List" },
  };

  componentDidMount() {
    if (this.state.list.id) {
      this.unsubscribe = onSnapshot(doc(db, 'lists', this.state.list.id), (doc) => {
        if (doc.exists()) {
          this.setState({ list: doc.data() });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  toggleTodoComplete = async (index) => {
    let updatedCards = [...this.state.list.cards];
    updatedCards[index].completed = !updatedCards[index].completed;
  
    const listRef = doc(db, "lists", this.state.list.id);
    await updateDoc(listRef, { cards: updatedCards });
  
    this.setState({ list: { ...this.state.list, cards: updatedCards } });
  };
  
  addTodo = async () => {
    if (!this.state.newCard.trim()) return;
  
    const listRef = doc(db, "lists", this.state.list.id);
    await updateDoc(listRef, {
      cards: arrayUnion({ title: this.state.newCard, completed: false })
    });
  
    this.setState({ newCard: "" });
    Keyboard.dismiss();
  };

  renderCards = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => this.toggleTodoComplete(index)}>
        <Ionicons
          name={item.completed ? "checkbox" : "square-outline"}
          size={24}
          color={item.completed ? "#54b367" : "#615c5c"}
          style={{ width: 32 }}
        />
      </TouchableOpacity>
      <Text style={[styles.todo, { textDecorationLine: item.completed ? "line-through" : "none", color: item.completed ? "#54b367" : "#9eada1" }]}>
        {item.title}
      </Text>
    </View>
  );

  render() {
    const { list } = this.state;
    const completedCount = (list.cards || []).filter(card => card.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={this.props.closeModal}>
            <AntDesign name="close" size={24} color="#000000" />
          </TouchableOpacity>

          <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
            <Text style={styles.title}>{list.name}</Text>
            <Text style={styles.taskCount}>{completedCount} of {list.cards.length} tasks</Text>
          </View>

          <FlatList
            data={list.cards || []}
            renderItem={this.renderCards}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              placeholder="Add a task..."
              onChangeText={(text) => this.setState({ newCard: text })}
              value={this.state.newCard}
            />
            <TouchableOpacity style={[styles.addButton, { backgroundColor: list.color }]} onPress={this.addTodo}>
              <AntDesign name="plus" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    alignSelf: "stretch",
  },
  header: {
    justifyContent: "center",
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#000000",
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: "#000000",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 64,
    right: 32,
    zIndex: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  todo: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
});
