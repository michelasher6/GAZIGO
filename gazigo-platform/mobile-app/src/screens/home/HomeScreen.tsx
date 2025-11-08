import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Surface } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Text variant="headlineMedium" style={styles.welcomeText}>
          {t('common.welcome')}
        </Text>
        <Text variant="bodyMedium" style={styles.sloganText}>
          {t('common.slogan')}
        </Text>
      </Surface>

      <View style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('orders.newOrder')}
            </Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Order your gas cylinder now
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('NewOrder' as never)}
              style={styles.cardButton}
            >
              Order Now
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              {t('orders.trackOrder')}
            </Text>
            <Text variant="bodyMedium" style={styles.cardText}>
              Track your active orders
            </Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Orders' as never)}
              style={styles.cardButton}
            >
              View Orders
            </Button>
          </Card.Content>
        </Card>
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
  welcomeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sloganText: {
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 8,
    color: '#1F2937',
    fontWeight: '600',
  },
  cardText: {
    marginBottom: 16,
    color: '#6B7280',
  },
  cardButton: {
    marginTop: 8,
  },
});

export default HomeScreen;

