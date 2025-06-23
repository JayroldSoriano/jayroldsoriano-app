import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { supabase } from '../../lib/supabase';

export default function ResetScreen() {
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleReset = async () => {
    setIsLoading(true);
    setEmailError(false);
    try {
      if (!email) {
        setEmailError(true);
        Alert.alert('Email Required', 'Please enter your email to continue.');
        return;
      }
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setEmailError(true);
        Alert.alert('Error', error.message);
        return;
      }
      Alert.alert('Check Email', 'Password reset instructions sent.');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={isLoading} message="Sending reset instructions..." />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={[styles.input, emailFocused && styles.inputFocused, emailError && styles.inputError]}
            placeholderTextColor="#888"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 80,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    color: '#127CFF',
  },
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#111',
  },
  formGroup: {
    marginBottom: 8,
  },
  input: {
    width: '100%',
    minHeight: 50,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    color: '#222',
  },
  inputFocused: {
    borderColor: '#339DFF',
    backgroundColor: '#EAF4FF',
    shadowColor: '#339DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  resetButton: {
    marginTop: 8,
    backgroundColor: '#127CFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
