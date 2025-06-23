import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { supabase } from '../../lib/supabase';
import useAuthStore from '../../stores/auth';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [recruitmentCode, setRecruitmentCode] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error states for each field
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const { setUser, initialize } = useAuthStore();

  const handleSignup = async () => {
    // Reset all errors
    setNameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmError(false);
    setCodeError(false);

    // Highlight all empty fields
    let missing = false;
    if (!name) { setNameError(true); missing = true; }
    if (!email) { setEmailError(true); missing = true; }
    if (!password) { setPasswordError(true); missing = true; }
    if (!confirmPassword) { setConfirmError(true); missing = true; }
    if (!recruitmentCode) { setCodeError(true); missing = true; }
    if (missing) {
      if (!name) {
        Alert.alert('Name Required', 'Please enter your name.');
      } else if (!email) {
        Alert.alert('Email Required', 'Please enter your email.');
      } else if (!password) {
        Alert.alert('Password Required', 'Please enter a password.');
      } else if (!confirmPassword) {
        Alert.alert('Confirm Password', 'Please confirm your password.');
      } else if (!recruitmentCode) {
        Alert.alert('Missing Code', 'Recruitment code is required.');
      }
      return;
    }

    // Name validation: no special characters or numbers
    if (!name) {
      setNameError(true);
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setNameError(true);
      Alert.alert('Invalid Name', 'Name should not include special characters or numbers.');
      return;
    }
    // Email validation: must have @ and end with a domain
    if (!email) {
      setEmailError(true);
      Alert.alert('Email Required', 'Please enter your email.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError(true);
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    // Password validation: at least 8 chars, 1 letter, 1 number
    if (!password) {
      setPasswordError(true);
      Alert.alert('Password Required', 'Please enter a password.');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password)) {
      setPasswordError(true);
      Alert.alert('Weak Password', 'Password must be at least 8 characters and include at least one letter and one number.');
      return;
    }
    if (!confirmPassword) {
      setConfirmError(true);
      Alert.alert('Confirm Password', 'Please confirm your password.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError(true);
      setConfirmError(true);
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (!recruitmentCode) {
      setCodeError(true);
      Alert.alert('Missing Code', 'Recruitment code is required.');
      return;
    }

    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, recruitmentCode },
        },
      });
      if (error) {
        setEmailError(true);
        setPasswordError(true);
        Alert.alert('Signup failed', error.message);
        return;
      }
      // Auto-login after successful signup
      const { error: loginError, data: loginData } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) {
        Alert.alert('Signup succeeded, but auto-login failed', loginError.message);
        return;
      }
      if (loginData?.user) setUser(loginData.user);
      if (initialize) initialize();
      Alert.alert('Success', 'Account created and logged in successfully');
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <LoadingOverlay visible={isLoading} message="Creating your account..." />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={[styles.input, nameFocused && styles.inputFocused, nameError && styles.inputError]}
            placeholderTextColor="#888"
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>
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
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={[styles.input, passwordFocused && styles.inputFocused, passwordError && styles.inputError]}
            placeholderTextColor="#888"
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={[styles.input, confirmFocused && styles.inputFocused, confirmError && styles.inputError]}
            placeholderTextColor="#888"
            onFocus={() => setConfirmFocused(true)}
            onBlur={() => setConfirmFocused(false)}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.formGroup}>
          <TextInput
            placeholder=" Recruitment Code (Required)"
            value={recruitmentCode}
            onChangeText={setRecruitmentCode}
            style={[styles.input, codeFocused && styles.inputFocused, codeError && styles.inputError]}
            placeholderTextColor="#888"
            onFocus={() => setCodeFocused(true)}
            onBlur={() => setCodeFocused(false)}
          />
        </View>
        <TouchableOpacity style={styles.createButton} onPress={handleSignup}>
          <Text style={styles.createButtonText}>Sign up</Text>
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
  createButton: {
    marginTop: 8,
    backgroundColor: '#42b72a',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
    zIndex: 2,
  },
});
