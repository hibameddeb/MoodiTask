import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";

export function ChatBot({ route, navigation }) {
  const mood = route.params?.mood || "Neutral"; 
  const [messages, setMessages] = useState([
    { text: `Hi! I see you're feeling ${mood.toLowerCase()} today. How can I help?`, sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return; 

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]); 

    try {
      const response = await axios.post(
        API_URL,
        { model: "deepseek/deepseek-r1-distill-llama-8b", messages: [{ role: "user", content: input }] },
        { headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" } }
      );

      const botResponse = response.data?.choices?.[0]?.message?.content || "I didn't quite get that.";
      setMessages((prevMessages) => [...prevMessages, { text: botResponse, sender: "bot" }]);

    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prevMessages) => [...prevMessages, { text: "Sorry, I couldn't respond.", sender: "bot" }]);
    }

    setInput(""); 
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={msg.sender === "user" ? styles.userMessageContainer : styles.botMessageContainer}>
            <Text style={msg.sender === "user" ? styles.userMessage : styles.botMessage}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },  // Light grayish background
  chatContainer: { flex: 1, marginBottom: 10 },

  // User Message - Softer Green
  userMessageContainer: { alignSelf: "flex-end", maxWidth: "80%", marginVertical: 5 },
  userMessage: {
    backgroundColor: "#A9DFBF", // Soft pastel green
    color: "#1E3A28",
    padding: 12,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    fontSize: 16,
  },

  // Bot Message - Softer Coral
  botMessageContainer: { alignSelf: "flex-start", maxWidth: "80%", marginVertical: 5 },
  botMessage: {
    backgroundColor: "#F5B7B1", // Soft pastel red
    color: "#5A2A27",
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    fontSize: 16,
  },

  // Input & Button
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#17B198",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ChatBot;
