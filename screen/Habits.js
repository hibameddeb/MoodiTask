import React, { useState } from 'react';
import { View, Pressable, StyleSheet, Text, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";

const Habits = () => {
  const [option, setOption] = useState(null);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AntDesign onPress={() => router.push("/Create")} name="plus" size={24} color="black" />
      </View>
      
      <Text style={styles.title}>Habits</Text>
      
      <View style={styles.optionContainer}>
        <Pressable
          onPress={() => setOption("daily")}
          style={[styles.optionButton, option === "daily" && styles.selectedOption]}
        >
          <Text>Daily</Text>
        </Pressable>

        <Pressable
          onPress={() => setOption("weekly")}
          style={[styles.optionButton, option === "weekly" && styles.selectedOption]}
        >
          <Text>Weekly</Text>
        </Pressable>

        <Pressable
          onPress={() => setOption("monthly")}
          style={[styles.optionButton, option === "monthly" && styles.selectedOption]}
        >
          <Text>Monthly</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    marginTop: 5,
    fontSize: 23,
    fontWeight: "500",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginVertical: 8,
  },
  optionButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  selectedOption: {
    backgroundColor: "#E0FFFF",
  },
});

export default Habits;
