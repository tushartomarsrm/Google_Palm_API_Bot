// const PALM_API_KEY = 'AIzaSyB7QOkMlGNPNAhH0HOV7pNt4kQcode8H64';

// src/ChatBot.js
import React, { useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const PALM_API_KEY = 'AIzaSyB7QOkMlGNPNAhH0HOV7pNt4kQcode8H64';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const generateText = async () => {
    if (inputText.trim() === '') {
      return;
    }

    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage';
    const requestData = {
      prompt: {
        context: '',
        examples: [],
        messages: [{ content: inputText }],
      },
      temperature: 0.25,
      top_k: 40,
      top_p: 0.95,
      candidate_count: 1,
    };

    const newUserMessage = {
      id: new Date().getTime(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().getTime(),
    };

    const processingMessage = {
      id: new Date().getTime() + 1,
      text: 'Processing...',
      sender: 'bot',
      timestamp: new Date().getTime(),
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage, processingMessage]);
    try {

      const response = await axios.post(`${apiUrl}?key=${PALM_API_KEY}`, requestData);

      if (response.status === 200) {
        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
          const botResponse = response.data.candidates[0].content;

          const newBotMessage = {
            id: new Date().getTime() + 2,
            text: botResponse,
            sender: 'bot',
            timestamp: new Date().getTime(),
          };

          setMessages(prevMessages => [...prevMessages.slice(0, -1), newBotMessage]);
          setInputText('');
          flatListRef.current.scrollToEnd({ animated: true });
        } else {
          console.error('Response structure is not as expected!!');
        }
      } else {
        console.error('Google Cloud API response failed with status: ', response.status);
      }
    } catch (error) {
      console.error('An error occurred while making the Google Cloud API: ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Google Palm API Bot</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        ref={flatListRef} // Assign the ref to the FlatList
        renderItem={({ item }) => (
          <View
            key={item.id} // Added unique key
            style={{
              alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 12,
            }}>
            <View
              style={{
                backgroundColor: item.sender === 'user' ? '#007AFF' : '#E5E5EA',
                padding: 10,
                borderRadius: 10,
              }}>
              <Text style={{ color: item.sender === 'user' ? 'white' : 'black' }}>
                {item.text}
              </Text>
              <Text
                style={{
                  color: item.sender === 'user' ? 'white' : 'black',
                  fontSize: 12,
                  marginTop: 4,
                }}>
                {new Date(item.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Let's Chat..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={generateText} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Changed background color to white
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    color: '#000', // Changed text color to black
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Added margin to input container
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000', // Changed text color to black
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sendButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
});

export default ChatBot;

