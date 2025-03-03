import React, { useState } from 'react';
import { 
    Text, View, KeyboardAvoidingView, TouchableOpacity, StyleSheet, 
    Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db, auth, addDoc, collection } from '../firebaseConfig';  
import { useNavigation } from '@react-navigation/native'; 

function AddListModal() {
    const navigation = useNavigation();
    const backgroundColors = ["#E04F5F", "#FFB6C1", "#FFD3B6", "#FF9A8B", "#FDCBBA", "#FF6B6B"];
    const [name, setName] = useState("");
    const [color, setColor] = useState(backgroundColors[0]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const renderColors = () => backgroundColors.map(colorItem => (
        <TouchableOpacity 
            key={colorItem} 
            style={[styles.colorSelect, { backgroundColor: colorItem, borderColor: color === colorItem ? "#222" : "#fff" }]}
            onPress={() => setColor(colorItem)} 
        />
    ));

    const createTodo = async () => {
        if (!name.trim()) {
            Alert.alert("Error", "Please enter a list name!");
            return;
        }
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const listRef = collection(db, "userId");
            await addDoc(listRef, { 
                name, 
                color, 
                userId: user.uid, 
                selectedDate: selectedDate.toISOString(),
                createdAt: new Date() 
            });

            setLoading(false);
            navigation.goBack();  
        } catch (error) {
            console.error("Error creating list:", error);
            Alert.alert("Error", "Failed to create list. Please try again.");
            setLoading(false);
        }
    };

    const dismissKeyboard = () => Keyboard.dismiss();

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <TouchableOpacity style={styles.closeIcon} onPress={() => navigation.goBack()}>
                    <AntDesign name="close" size={24} color="#900C3F" />
                </TouchableOpacity>

                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Create To-Do List</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="List Name..." 
                        mode="outlined" 
                        onChangeText={setName}
                        value={name} 
                    />
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                        <Text style={styles.datePickerText}>Select Date: {selectedDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker 
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) setSelectedDate(date);
                            }}
                        />
                    )}
                    <View style={styles.colorContainer}>{renderColors()}</View>
                    <TouchableOpacity 
                        style={[styles.createButton, { backgroundColor: color }]} 
                        onPress={createTodo}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>Create</Text>}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    innerContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    createButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    createText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
    colorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    colorSelect: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    closeIcon: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    datePickerButton: {
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 5,
        marginBottom: 20,
        alignItems: "center",
    },
    datePickerText: {
        fontSize: 16,
        color: "#333",
    },
});

export default AddListModal;

