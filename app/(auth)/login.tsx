import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../stores/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { initialize, setUser } = useAuthStore();

  useEffect(() => {
    if (email && password) setLoginError(false);
  }, [email, password]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        setLoginError(true);
        Alert.alert(
          !email ? 'Email Required' : 'Password Required',
          !email ? 'Please enter your email to continue.' : 'Please enter your password to continue.',
          [
            { text: 'OK', style: 'default', isPreferred: true },
            ...(email ? [] : [{ text: 'Reset Password', onPress: () => router.push('/reset') }]),
          ]
        );
        return;
      }

      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginError(true);
        if (error.message === 'Invalid login credentials') {
          Alert.alert(
            'Did you forget your password?',
            "We can help you log into your account if you've forgotten your password.",
            [
              {
                text: 'Forgot password',
                style: 'default',
                isPreferred: true,
                onPress: () => router.push('/reset'),
              },
              { text: 'Try again', style: 'cancel' },
            ]
          );
        } else {
          Alert.alert('Login failed', error.message);
        }
        return;
      }

      // Update Zustand and refresh session
      if (data?.user) setUser(data.user);
      if (initialize) initialize();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} message="Logging in..." />
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.formGroup}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            placeholder="Enter email"
            placeholderTextColor="#888"
            style={[styles.input, emailFocused && styles.inputFocused, loginError && styles.inputError]}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>
        <View style={styles.formGroup}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#888"
            style={[
              styles.input,
              passwordFocused && styles.inputFocused,
              loginError && styles.inputError,
            ]}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/reset')}>
          <Text style={styles.forgot}>Reset password?</Text>
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/signup')}>
          <Text style={styles.createButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    marginTop: 200,
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
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#222',
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
  button: {
    marginTop: 8,
    backgroundColor: '#127CFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forgot: {
    color: '#127CFF',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 18,
    fontSize: 13,
    fontWeight: '500',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#888',
    fontWeight: 'bold',
  },
  createButton: {
    marginTop: 10,
    backgroundColor: '#42b72a',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
