import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services/order.service';

const OrderDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const orderId = (route.params as any)?.orderId;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Order Details
          </Text>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Tracking Number:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {order.trackingNumber || order.id}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Status:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {t(`orders.${order.status}`)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Cylinder Type:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {order.cylinderType}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Quantity:
            </Text>
            <Text variant="bodyMedium" style={styles.value}>
              {order.quantity}
            </Text>
          </View>
          <View style={styles.row}>
            <Text variant="bodyMedium" style={styles.label}>
              Total Amount:
            </Text>
            <Text variant="bodyMedium" style={[styles.value, styles.amount]}>
              {order.totalAmount.toLocaleString()} FCFA
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    marginBottom: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    color: '#6B7280',
  },
  value: {
    color: '#1F2937',
    fontWeight: '500',
  },
  amount: {
    color: '#1E90FF',
    fontWeight: '600',
  },
});

export default OrderDetailScreen;

