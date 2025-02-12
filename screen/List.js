import React, { useState } from 'react'; 
import { View, TouchableOpacity, StyleSheet, Text, Modal, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import tempData from './tempData'; 
import Cards from './Cards'; 
import AddListModel from './AddListModel';
import { useNavigation } from '@react-navigation/native'; 


const List = () => {
  const navigation = useNavigation();
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [list, setList] = useState(tempData);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const addList = (newList) => {
    setList([...list, { ...newList, id: list.length + 1, Cards: [] }]);
  };

  const updateList = (updatedList) => {
    
    setList(prevList => 
      prevList.map(item => item.id === updatedList.id ? updatedList : item)
    );
  };

  const renderList = (list) => {
    return <Cards list={list} updateList={updateList} />;
  };

  return (
    <View style={styles.container}>
     

      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id.toString()} 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)} 
          keyboardShouldPersistTaps="always"        
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  divider: {
    backgroundColor: "#0080ff",
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#000000",
    paddingHorizontal: 64,
  },
  addlist: {
    borderWidth: 2,
    borderColor: "#0080ff",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: "#ff5733",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});

export default Exemple;
