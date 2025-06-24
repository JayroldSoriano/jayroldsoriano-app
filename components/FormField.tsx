import React from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

interface FormFieldProps extends TextInputProps {
  error?: boolean;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function FormField({
  error,
  errorMessage,
  containerStyle,
  children,
  style,
  ...props
}: FormFieldProps) {
  return (
    <View style={[styles.formGroup, containerStyle]}>
      <View style={{ position: 'relative' }}>
        <TextInput
          style={[
            styles.input,
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor="#888"
          {...props}
        />
        {children}
      </View>
      {error && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
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
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
}); 