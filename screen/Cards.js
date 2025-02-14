import React from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import TodoModal from './TodoModal';

export default class Cards extends React.Component {
  state = {
    showListVisible: false,
  };

  toggleListModal = () => {
    this.setState((prevState) => ({ showListVisible: !prevState.showListVisible }));
  };

  render() {
    const { list } = this.props; // Ensure list is coming from props
    if (!list) return null; // Handle missing data safely

    const completedCount = (list.cards || []).filter(card => card.completed).length;
    const remainingCount = (list.cards || []).length - completedCount;

    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showListVisible}
          onRequestClose={this.toggleListModal}
        >
          <TodoModal 
            list={list} 
            closeModal={this.toggleListModal} 
            updateList={this.props.updateList} // Ensure this function updates Firebase
          />
        </Modal>

        <TouchableOpacity
          style={[styles.listContainer, { backgroundColor: list.color || '#808080' }]}
          onPress={this.toggleListModal}
        >
          <Text style={styles.listTitle} numberOfLines={1}>
            {list.name || 'Unnamed List'}
          </Text>

          <View>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.count}>{remainingCount}</Text>
              <Text style={styles.subtitle}>Remaining</Text>
            </View>

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.count}>{completedCount}</Text>
              <Text style={styles.subtitle}>Completed</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    margin: 12,
    alignItems: 'center',
    width: 200,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 18,
  },
  count: {
    fontSize: 48,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
