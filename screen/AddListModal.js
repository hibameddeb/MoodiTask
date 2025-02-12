import React, { Component } from 'react';
import { 
    Text, View, KeyboardAvoidingView, TouchableOpacity, StyleSheet, 
    Platform, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

export default class AddListModal extends Component {
    backgroundColors = ["#3559cb", "#C70039", "#581845", "#DAF7A6", "#FF5733", "#cb356d", "#cb3543"];

    state = {
        name: "",
        color: this.backgroundColors[0],
    };

    renderColors() {
        return this.backgroundColors.map(color => (
            <TouchableOpacity 
                key={color} 
                style={[
                    styles.colorSelect, 
                    { backgroundColor: color, borderColor: this.state.color === color ? "#222" : "#fff" }
                ]}
                onPress={() => this.setState({ color })} 
            />
        ));
    }

    createTodo = () => {
        const { name, color } = this.state;
        if (!name.trim()) return;

        const list = { name, color };
        this.props.addList(list); 

        this.setState({ name: "" });
        this.props.closeModal();
    };

    dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.dismissKeyboard}>
                <KeyboardAvoidingView 
                    style={styles.container}  
                    
                >
                    <TouchableOpacity 
                        style={styles.closeIcon}
                        onPress={this.props.closeModal}
                    >
                        <AntDesign name="close" size={24} color="#900C3F" />
                    </TouchableOpacity>

                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Create To-Do List</Text>

                        <TextInput 
                            style={styles.input} 
                            placeholder="List Name..." 
                            mode="outlined" 
                            onChangeText={text => this.setState({ name: text })}
                            value={this.state.name} 
                        />

                        <View style={styles.colorContainer}>
                            {this.renderColors()}
                        </View>

                        <TouchableOpacity 
                            style={[styles.createButton, { backgroundColor: this.state.color }]} 
                            onPress={this.createTodo}
                        >
                            <Text style={styles.createText}>Create</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        paddingHorizontal: 20,
        justifyContent: "center",
        top:150
    },
    innerContainer: {
        alignSelf: "stretch",
        marginHorizontal: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#C70039",
        borderRadius: 8,
        backgroundColor:"#ffffff",
        marginTop: 20,
        fontSize: 18,
        paddingHorizontal: 12,
        height: 50,
        
    },
    createButton: {
        marginTop: 200,
        height: 50,
        width: "80%", 
        alignSelf: "center",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    createText: {
        color: "#ffffff",
        fontWeight: "20000",
        fontSize: 16,
    },
    colorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 16,
        flexWrap: "wrap",
    },
    colorSelect: {
        marginTop: 50,
        width: 40,
        height: 40,
        borderRadius: 6,
        marginHorizontal: 6,
        borderWidth: 3,
        borderColor: "#fff",
        elevation: 3,
    },
    closeIcon: {
        position: "absolute",
        top: 5,
        right: 30,
    },
});