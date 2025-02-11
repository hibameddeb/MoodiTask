import { Ionicons, AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';

const data = [
  { label: 'Health', value: '1' },
  { label: 'Education', value: '2' },
  { label: 'Leisure', value: '3' },
  { label: 'Work', value: '4' },
  { label: 'Personal', value: '5' },
];

const Create = () => {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const [value, setValue] = useState(null);

  return (
    <View style={styles.container}>
     
      <Pressable style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

   
      <Text style={styles.title}>
        Create <Text style={styles.boldText}>Habit</Text>
      </Text>

     
      <TextInput
        style={styles.input}
        placeholder="Title"
      />

      <Text style={styles.sectionTitle}>Repeat</Text>
      <View style={styles.repeatContainer}>
        {["Daily", "Weekly", "Monthly"].map((label, index) => (
          <Pressable key={index} style={styles.repeatButton}>
            <Text style={styles.textCenter}>{label}</Text>
          </Pressable>
        ))}
      </View>

  
      <Text style={styles.sectionTitle}>On these days</Text>
      <View style={styles.daysContainer}>
        {days.map((item, index) => (
          <Pressable key={index} style={styles.dayButton}>
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>

   
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => setValue(item.value)}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />

      
      <View style={styles.reminderContainer}>
        <Text style={styles.sectionTitle}>Reminder:</Text>
        <Text style={styles.reminderText}>Yes</Text>
      </View>

     
      <Pressable style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 5,
  },
  title: {
    fontSize: 20,
    marginTop: 10,
  },
  boldText: {
    fontSize: 20,
    fontWeight: "500",
  },
  input: {
    width: "95%",
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#E1EBEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 15,
  },
  repeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  repeatButton: {
    backgroundColor: '#AFDBF5',
    padding: 10,
    flex: 1,
    borderRadius: 25,
  },
  textCenter: {
    textAlign: "center",
  },
  daysContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  reminderText: {
    fontSize: 18,
    fontWeight: "500",
    color: '#2774AE',
    marginLeft: 10,
  },
  saveButton: {
    marginTop: 25,
    backgroundColor: "#00428c",
    padding: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});

export default Create;
