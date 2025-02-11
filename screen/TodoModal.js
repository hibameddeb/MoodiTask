import { AntDesign, Ionicons } from '@expo/vector-icons';
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, FlatList, KeyboardAvoidingView, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class TodoModal extends Component {
  state = {
    newCard: "",
  };

  toggleTodoComplete = (index) => {
    const list = this.props.list || { cards: [] };
    if (list.cards[index]) {  // Make sure the card exists
      list.cards[index].completed = !list.cards[index].completed;
      this.props.updateList(list);
    }
  };

  addTodo = () => {
    // Ensure list is defined
    const list = this.props.list || { cards: [] };
    if (this.state.newCard.trim() === "") return; // Prevent adding empty cards
    list.cards.push({ title: this.state.newCard, completed: false });
    this.props.updateList(list);
    this.setState({ newCard: "" });

    Keyboard.dismiss();
  };

  renderCards = (card, index) => {
    return (
      <View style={styles.cardcontainer}>
        <TouchableOpacity onPress={() => this.toggleTodoComplete(index)}>
          <Ionicons
            name={card.completed ? "square" : "square-outline"} // Ensure correct icon names
            size={24}
            color="#615c5c"
            style={{ width: 32 }}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.todo,
            {
              textDecorationLine: card.completed ? "line-through" : "none",
              color: card.completed ? "#54b367" : "#9eada1",
            },
          ]}
        >
          {card.title}
        </Text>
      </View>
    );
  };

  render() {
    // Ensure list is defined
    const list = this.props.list || { cards: [], color: '#808080', name: 'Unnamed List' };
    const completedCount = (list.cards || []).filter((card) => card.completed).length;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: 64, right: 32, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={24} color="#000000" />
          </TouchableOpacity>

          <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>{completedCount} of {list.cards.length} tasks</Text>
            </View>
          </View>

          <View style={[styles.section, { flex: 3 }]}>
            <FlatList
              data={list.cards || []} 
              renderItem={({ item, index }) => this.renderCards(item, index)}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              onChangeText={(text) => this.setState({ newCard: text })}
              value={this.state.newCard}
            />
            <TouchableOpacity style={[styles.card, { backgroundColor: list.color }]} onPress={this.addTodo}>
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
    flex: 1,
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
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  card: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardcontainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  todo: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 16,
  },
});
