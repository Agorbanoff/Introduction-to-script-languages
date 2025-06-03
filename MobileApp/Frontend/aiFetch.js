// Frontend/AIFitnessChat.js
import { BASE_API } from "./apiConfig";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { authFetch } from "./authFetch"; // your existing helper
import { Ionicons } from "@expo/vector-icons"; // for send/back icons

export default function AIFitnessChat({ navigation }) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hi! I’m your AI fitness assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef(null);

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // 1) Add the user message to chat
    const userMsg = {
      id: Date.now(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    Keyboard.dismiss();

    // 2) Call AI endpoint
    setIsLoading(true);
    try {
      const res = await authFetch(`${BASE_API}/ai/generateplan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        // If we get a non‐200 response, show a fallback
        const errJson = await res.json();
        console.warn("AI Chat error response:", errJson);
        const fallbackMsg = {
          id: Date.now() + 1,
          text: "Sorry, I couldn’t reach the AI server. Try again later.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } else {
        // Pull out plan_raw instead of expecting 'reply'
        const data = await res.json();
        const planText = data.plan_raw || "No plan returned.";
        const botMsg = {
          id: Date.now() + 1,
          text: planText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error("Network or AI Chat error:", error);
      const botMsg = {
        id: Date.now() + 1,
        text: "Network error. Please check your connection and try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageBubble = (msg) => {
    const isUser = msg.sender === "user";
    return (
      <View
        key={msg.id}
        style={[
          styles.bubbleContainer,
          isUser ? styles.userBubbleContainer : styles.botBubbleContainer,
        ]}
      >
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>
            {msg.text}
          </Text>
          <Text style={styles.bubbleTime}>
            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("./Images/gymPhoto.jpg")} // replace with your own background if needed
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Top bar with back arrow */}
            <View style={styles.topBar}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.topBarTitle}>AI Fitness Chat</Text>
            </View>

            {/* Scrollable chat area */}
            <ScrollView
              style={styles.chatArea}
              contentContainerStyle={styles.chatContent}
              ref={scrollViewRef}
            >
              {messages.map((m) => renderMessageBubble(m))}
            </ScrollView>

            {/* Input row */}
            <View style={styles.inputRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type your question..."
                placeholderTextColor="#888"
                style={styles.textInput}
                multiline
                editable={!isLoading}
              />
              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={isLoading}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={isLoading ? "#555" : "#1db344"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: "#000" },
  container: { flex: 1 },
  innerContainer: {
    flex: 1,
    backgroundColor: "rgba(33,33,33,0.85)",
  },
  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  topBarTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 12,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatContent: {
    paddingVertical: 10,
  },
  bubbleContainer: {
    flexDirection: "row",
    marginVertical: 4,
  },
  userBubbleContainer: {
    justifyContent: "flex-end",
  },
  botBubbleContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#1db344",
    borderBottomRightRadius: 0,
  },
  botBubble: {
    backgroundColor: "#222",
    borderBottomLeftRadius: 0,
  },
  bubbleText: {
    color: "#FFF",
    fontSize: 16,
  },
  userBubbleText: {
    color: "#000",
  },
  bubbleTime: {
    fontSize: 10,
    color: "#AAA",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#111",
    borderTopWidth: 1,
    borderColor: "#333",
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    color: "#FFF",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#222",
    borderRadius: 20,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
