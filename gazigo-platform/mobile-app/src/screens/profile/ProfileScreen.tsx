import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Profile
        </Text>
      </Surface>

      <View style={styles.content}>
        <Surface style={styles.surface}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Account Information
          </Text>
          <List.Item
            title="Phone Number"
            description={user?.phoneNumber}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Role"
            description={user?.role}
            left={(props) => <List.Icon {...props} icon="account" />}
          />
        </Surface>

        <Surface style={styles.surface}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Settings
          </Text>
          <List.Item
            title="Language"
            description="English / Français"
            left={(props) => <List.Icon {...props} icon="translate" />}
            onPress={() => {
              // TODO: Language selection
            }}
          />
          <List.Item
            title="Notifications"
            description="Manage notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            onPress={() => {
              // TODO: Notification settings
            }}
          />
        </Surface>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#EF4444"
        >
          {t('auth.logout')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 24,
    backgroundColor: '#1E90FF',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  surface: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 24,
    paddingVertical: 4,
  },
});

export default ProfileScreen;

