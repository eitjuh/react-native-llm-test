import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

import * as AppleIntelligence from '@/modules/apple-intelligence';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Checking availability...');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check Apple Intelligence availability on mount
  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    const status = await AppleIntelligence.getAvailabilityStatus();
    setIsAvailable(status.isAvailable);
    setStatusMessage(status.message);
  };

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    const promptText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      const result = await AppleIntelligence.generateResponse(promptText);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: result.success ? (result.response ?? '') : `Error: ${result.error}`,
                isStreaming: false,
              }
            : msg
        )
      );
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                isStreaming: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const clearChat = () => {
    setMessages([]);
  };

  const colors = {
    background: isDark ? '#0A0A0F' : '#F5F5F7',
    cardBg: isDark ? 'rgba(30, 30, 40, 0.8)' : 'rgba(255, 255, 255, 0.9)',
    text: isDark ? '#FFFFFF' : '#1D1D1F',
    textSecondary: isDark ? '#8E8E93' : '#6E6E73',
    userBubble: '#0A84FF',
    assistantBubble: isDark ? 'rgba(44, 44, 50, 0.9)' : 'rgba(229, 229, 234, 0.9)',
    inputBg: isDark ? 'rgba(44, 44, 50, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    border: isDark ? 'rgba(84, 84, 88, 0.4)' : 'rgba(0, 0, 0, 0.1)',
    accent: '#0A84FF',
    gradientStart: isDark ? '#1A1A2E' : '#667EEA',
    gradientEnd: isDark ? '#16213E' : '#764BA2',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <View style={styles.appleIcon}>
                <Ionicons name="sparkles" size={24} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Apple Intelligence</Text>
                <Text style={styles.headerSubtitle}>On-Device LLM Demo</Text>
              </View>
            </View>
            {messages.length > 0 && (
              <Pressable onPress={clearChat} style={styles.clearButton}>
                <Ionicons name="trash-outline" size={20} color="rgba(255,255,255,0.8)" />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Status Badge */}
        <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.statusContainer}>
          <BlurView intensity={40} tint="dark" style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    isAvailable === null
                      ? '#FFD60A'
                      : isAvailable
                        ? '#30D158'
                        : '#FF453A',
                },
              ]}
            />
            <Text style={styles.statusText}>{statusMessage}</Text>
          </BlurView>
        </Animated.View>
      </LinearGradient>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.chatContainer}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <Animated.View entering={FadeIn.duration(600).delay(500)} style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.assistantBubble }]}>
                <Ionicons name="chatbubbles-outline" size={48} color={colors.textSecondary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Start a Conversation
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Ask anything! All processing happens privately on your device using Apple's
                Foundation Models.
              </Text>
              <View style={styles.suggestionsContainer}>
                {[
                  'Explain quantum computing simply',
                  'Write a haiku about coding',
                  'What makes a good UI design?',
                ].map((suggestion, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setInputText(suggestion)}
                    style={[styles.suggestionChip, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
                  >
                    <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          ) : (
            messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={SlideInRight.duration(300).delay(index * 50)}
                style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  {
                    backgroundColor:
                      message.role === 'user' ? colors.userBubble : colors.assistantBubble,
                  },
                ]}
              >
                {message.role === 'assistant' && (
                  <View style={styles.assistantHeader}>
                    <Ionicons name="sparkles" size={14} color={colors.accent} />
                    <Text style={[styles.assistantLabel, { color: colors.accent }]}>
                      Apple Intelligence
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.messageText,
                    { color: message.role === 'user' ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {message.content || (message.isStreaming ? '...' : '')}
                </Text>
                {message.isStreaming && (
                  <View style={styles.streamingIndicator}>
                    <ActivityIndicator size="small" color={colors.accent} />
                  </View>
                )}
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* Input Area */}
        <Animated.View
          entering={FadeInUp.duration(400).delay(400)}
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.cardBg,
              borderTopColor: colors.border,
              paddingBottom: insets.bottom + 8,
            },
          ]}
        >
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.inputBlur}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Ask Apple Intelligence..."
                placeholderTextColor={colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={2000}
                editable={isAvailable === true && !isLoading}
              />
              <Pressable
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading || !isAvailable}
                style={({ pressed }) => [
                  styles.sendButton,
                  {
                    backgroundColor:
                      inputText.trim() && !isLoading && isAvailable
                        ? colors.accent
                        : colors.inputBg,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="arrow-up"
                    size={20}
                    color={inputText.trim() && isAvailable ? '#FFFFFF' : colors.textSecondary}
                  />
                )}
              </Pressable>
            </View>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    marginTop: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 10,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
    textAlign: 'center',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  assistantLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  streamingIndicator: {
    marginTop: 8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  inputBlur: {
    padding: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    fontSize: 16,
    borderWidth: 1,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
