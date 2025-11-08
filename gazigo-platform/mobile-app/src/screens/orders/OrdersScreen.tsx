import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { orderService, Order } from '../../services/order.service';

const OrdersScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getMyOrders(),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      preparing: '#8B5CF6',
      dispatched: '#6366F1',
      in_transit: '#06B6D4',
      delivered: '#10B981',
      cancelled: '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetail' as never, { orderId: item.id } as never)}
    >
      <Card.Content>
        <View style={styles.orderHeader}>
          <Text variant="titleMedium" style={styles.orderId}>
            #{item.trackingNumber || item.id.slice(0, 8)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>
              {t(`orders.${item.status}`)}
            </Text>
          </View>
        </View>
        <Text variant="bodyMedium" style={styles.orderInfo}>
          {item.cylinderType} - {item.quantity}x
        </Text>
        <Text variant="bodySmall" style={styles.orderAmount}>
          {item.totalAmount.toLocaleString()} FCFA
        </Text>
      </Card.Content>
    </Card>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders && orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <View style={styles.center}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No orders yet
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewOrder' as never)}
            style={styles.emptyButton}
          >
            {t('orders.newOrder')}
          </Button>
        </View>
      )}
    </View>
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  orderInfo: {
    marginBottom: 4,
    color: '#6B7280',
  },
  orderAmount: {
    color: '#1E90FF',
    fontWeight: '600',
  },
  emptyText: {
    marginBottom: 16,
    color: '#6B7280',
  },
  emptyButton: {
    marginTop: 8,
  },
});

export default OrdersScreen;

