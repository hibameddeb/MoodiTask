import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import {AntDesign} from '@expo/vector-icons'
import { FlatList } from 'react-native-reanimated';
import tempData from './tempData';
import Cards from "./Cards.js";

const Todolist = () => {
    
    return (
        <View style={styles.container}>
           <View style={{ flexDirection:'row'}}>
            <View style={styles.divider}/>
                <Text style={styles.title} >
                    todolist <Text style={{ fontWeight:'300', color:"#fff"}} ></Text>
                </Text>
            <View style={styles.divider}/>
            </View>
            <View style={{ marginVertical:48}}>
                <TouchableOpacity style={styles.addlist} >
                    <AntDesign name='plus' size={16} color={"0080ff"}/>
                </TouchableOpacity>
                <Text style={styles.add}>add List</Text>
            </View> 
            <View style={{ height:275, paddigLeft:32}}>
                <FlatList data={tempData} keyExtractor={item=> item.name}
                     horizontal={true}
                     showsVerticalScrollIndicator={false}
                     renderItem={({item})=> 
                     <Cards list={item}/>
                        }/>
            </View>
        </View>
    )};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff",
    alignItems:"center",
    justifyContent:"center"
  },
  divider:{
    backgroundColor:"#0080ff",
    height:1,
    flex:1,
    alignSelf:"center"
  },
  title:{
    fontSize:36,
    fontWeight:"800",
    color:"#000000",
    paddingHorizontal:64
  },
  addlist:{
    borderWidth:2,
    borderColor:"#0080ff",
    borderRadius:4,
    padding:16,
    alignItems:"center",
    justifyContent:"center"
  },
  add:{
    color:"#ff5733",
    fontWeight:"600",
    fontSize:14,
    marginTop:8
  },
  
});

export default Todolist;
