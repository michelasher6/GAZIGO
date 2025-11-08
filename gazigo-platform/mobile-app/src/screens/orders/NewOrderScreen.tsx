import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  Card,
  Surface,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { orderService, CreateOrderData } from '../../services/order.service';

const CYLINDER_TYPES = ['6kg', '12kg', '15kg', '20kg'] as const;
const PAYMENT_METHODS = [
  { value: 'mobile_money_mtn', label: 'MTN Mobile Money' },
  { value: 'mobile_money_orange', label: 'Orange Money' },
  { value: 'cash', label: 'Cash on Delivery' },
] as const;

const NewOrderScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [cylinderType, setCylinderType] = useState<'6kg' | '12kg' | '15kg' | '20kg'>('12kg');
  const [orderType, setOrderType] = useState<'new' | 'exchange'>('new');
  const [quantity, setQuantity] = useState('1');
  const [paymentMethod, setPaymentMethod] = useState<
    'mobile_money_mtn' | 'mobile_money_orange' | 'cash'
  >('mobile_money_mtn');
  const [deliveryAddressId, setDeliveryAddressId] = useState('');

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderData) => orderService.createOrder(data),
    onSuccess: (order) => {
      navigation.navigate('OrderDetail' as never, { orderId: order.id } as never);
    },
  });

  const handleSubmit = () => {
    if (!deliveryAddressId) {
      // TODO: Show address selection or create new address
      return;
    }

    createOrderMutation.mutate({
      cylinderType,
      orderType,
      quantity: parseInt(quantity, 10),
      deliveryAddressId,
      paymentMethod,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface}>
          <Text variant="headlineSmall" style={styles.title}>
            {t('orders.newOrder')}
          </Text>

          <Text variant="labelLarge" style={styles.label}>
            {t('orders.cylinderType')}
          </Text>
          <View style={styles.radioGroup}>
            {CYLINDER_TYPES.map((type) => (
              <View key={type} style={styles.radioOption}>
                <RadioButton
                  value={type}
                  status={cylinderType === type ? 'checked' : 'unchecked'}
                  onPress={() => setCylinderType(type)}
                />
                <Text>{type}</Text>
              </View>
            ))}
          </View>

          <Text variant="labelLarge" style={styles.label}>
            Order Type
          </Text>
          <View style={styles.radioGroup}>
            <View style={styles.radioOption}>
              <RadioButton
                value="new"
                status={orderType === 'new' ? 'checked' : 'unchecked'}
                onPress={() => setOrderType('new')}
              />
              <Text>New Cylinder</Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="exchange"
                status={orderType === 'exchange' ? 'checked' : 'unchecked'}
                onPress={() => setOrderType('exchange')}
              />
              <Text>Exchange</Text>
            </View>
          </View>

          <TextInput
            label={t('orders.quantity')}
            value={quantity}
            onChangeText={setQuantity}
            mode="outlined"
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text variant="labelLarge" style={styles.label}>
            {t('payment.selectMethod')}
          </Text>
          {PAYMENT_METHODS.map((method) => (
            <View key={method.value} style={styles.radioOption}>
              <RadioButton
                value={method.value}
                status={paymentMethod === method.value ? 'checked' : 'unchecked'}
                onPress={() => setPaymentMethod(method.value as any)}
              />
              <Text>{method.label}</Text>
            </View>
          ))}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={createOrderMutation.isPending}
            disabled={createOrderMutation.isPending}
            style={styles.button}
          >
            {t('common.submit')}
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 20,
  },
  surface: {
    padding: 24,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    marginBottom: 24,
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    color: '#1F2937',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    paddingVertical: 4,
  },
});

export default NewOrderScreen;

