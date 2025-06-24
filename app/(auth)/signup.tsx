import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FormField from '../../components/FormField';
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
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [codeError, setCodeError] = useState('');

  const { setUser, initialize } = useAuthStore();

  const handleSignup = async () => {
    // Reset all errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setCodeError('');

    // Highlight all empty fields
    let missing = false;
    if (!name) { setNameError('Please enter your name.'); missing = true; }
    if (!email) { setEmailError('Please enter your email.'); missing = true; }
    if (!password) { setPasswordError('Please enter a password.'); missing = true; }
    if (!confirmPassword) { setConfirmError('Please confirm your password.'); missing = true; }
    if (!recruitmentCode) { setCodeError('Recruitment code is required.'); missing = true; }
    if (missing) return;

    // Name validation: no special characters or numbers
    if (!/^[A-Za-z\s]+$/.test(name)) {
      setNameError('Name should not include special characters or numbers.');
      return;
    }
    // Email validation: must have @ and end with a domain
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    // Password validation: at least 8 chars, 1 letter, 1 number
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password)) {
      setPasswordError('Password must be at least 8 characters and include at least one letter and one number.');
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setConfirmError('Passwords do not match.');
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
        setEmailError(error.message);
        setPasswordError(error.message);
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
        <FormField
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            nameFocused && styles.inputFocused,
          ]}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          error={!!nameError}
          errorMessage={nameError}
        />
        <FormField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={[
            styles.input,
            emailFocused && styles.inputFocused,
          ]}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          error={!!emailError}
          errorMessage={emailError}
        />
        <FormField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[
            styles.input,
            passwordFocused && styles.inputFocused,
          ]}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          error={!!passwordError}
          errorMessage={passwordError}
          children={
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          }
        />
        <FormField
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          style={[
            styles.input,
            confirmFocused && styles.inputFocused,
          ]}
          onFocus={() => setConfirmFocused(true)}
          onBlur={() => setConfirmFocused(false)}
          error={!!confirmError}
          errorMessage={confirmError}
          children={
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          }
        />
        <FormField
          placeholder=" Recruitment Code (Required)"
          value={recruitmentCode}
          onChangeText={setRecruitmentCode}
          style={[
            styles.input,
            codeFocused && styles.inputFocused,
          ]}
          onFocus={() => setCodeFocused(true)}
          onBlur={() => setCodeFocused(false)}
          error={!!codeError}
          errorMessage={codeError}
        />
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
  input: {
    // This is just for focus styling, main input style is in FormField
  },
  inputFocused: {
    borderColor: '#339DFF',
    backgroundColor: '#EAF4FF',
    shadowColor: '#339DFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
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
