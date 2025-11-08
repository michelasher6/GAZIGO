import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const OTPScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { login } = useAuth();
  const phoneNumber = (route.params as any)?.phoneNumber || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(phoneNumber, otp);
      // Navigation will be handled by AppNavigator based on auth state
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Surface style={styles.surface}>
          <Text variant="headlineSmall" style={styles.title}>
            {t('auth.enterOtp')}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {t('auth.otpSent')}
          </Text>
          <Text variant="bodySmall" style={styles.phoneText}>
            {phoneNumber}
          </Text>

          <TextInput
            label={t('auth.enterOtp')}
            value={otp}
            onChangeText={setOtp}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!error}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleVerify}
            loading={loading}
            disabled={loading || otp.length !== 6}
            style={styles.button}
          >
            {t('auth.verify')}
          </Button>

          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <Button
              mode="text"
              onPress={() => {
                setTimer(60);
                // Resend OTP logic
              }}
            >
              {t('auth.resendOtp')}
            </Button>
          )}
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#1E90FF',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#6B7280',
  },
  phoneText: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
    fontWeight: '500',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 8,
    fontSize: 12,
  },
  timerText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#6B7280',
    fontSize: 12,
  },
});

export default OTPScreen;

