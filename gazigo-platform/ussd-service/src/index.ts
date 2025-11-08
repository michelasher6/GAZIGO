import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// USSD session state management
const sessions = new Map<string, any>();

// USSD menu handler
app.post('/ussd', async (req: Request, res: Response) => {
  const { phoneNumber, text, sessionId } = req.body;

  let response = '';
  let session = sessions.get(sessionId) || { step: 'main', data: {} };

  if (!text || text === '') {
    // Initial menu
    response = `CON Welcome to GAZIGO
1. Place Order
2. Check Order Status
3. My Account
0. Exit`;
    session.step = 'main';
  } else {
    const input = text.split('*');
    const lastInput = input[input.length - 1];

    switch (session.step) {
      case 'main':
        if (lastInput === '1') {
          response = `CON Select Cylinder Type:
1. 6kg
2. 12kg
3. 15kg
4. 20kg
0. Back`;
          session.step = 'select_cylinder';
        } else if (lastInput === '2') {
          response = `CON Enter Order Tracking Number:
0. Back`;
          session.step = 'check_order';
        } else if (lastInput === '3') {
          response = `CON My Account
Phone: ${phoneNumber}
0. Back`;
          session.step = 'account';
        } else {
          response = 'END Thank you for using GAZIGO';
        }
        break;

      case 'select_cylinder':
        const cylinderTypes = ['6kg', '12kg', '15kg', '20kg'];
        if (lastInput >= '1' && lastInput <= '4') {
          session.data.cylinderType = cylinderTypes[parseInt(lastInput) - 1];
          response = `CON Select Payment:
1. MTN Mobile Money
2. Orange Money
3. Cash on Delivery
0. Back`;
          session.step = 'select_payment';
        } else {
          session.step = 'main';
          response = `CON Welcome to GAZIGO
1. Place Order
2. Check Order Status
3. My Account
0. Exit`;
        }
        break;

      case 'select_payment':
        const paymentMethods = [
          'mobile_money_mtn',
          'mobile_money_orange',
          'cash',
        ];
        if (lastInput >= '1' && lastInput <= '3') {
          session.data.paymentMethod = paymentMethods[parseInt(lastInput) - 1];
          // Create order via API
          try {
            const orderResponse = await axios.post(
              `${API_BASE_URL}/orders`,
              {
                ...session.data,
                quantity: 1,
                orderType: 'new',
                deliveryAddressId: 'default', // Should be handled properly
              },
              {
                headers: {
                  Authorization: `Bearer ${session.data.token}`, // Should get from user session
                },
              }
            );
            response = `END Order placed successfully!
Tracking: ${orderResponse.data.trackingNumber}
Thank you!`;
          } catch (error) {
            response = 'END Error placing order. Please try again.';
          }
          sessions.delete(sessionId);
        } else {
          session.step = 'select_cylinder';
          response = `CON Select Cylinder Type:
1. 6kg
2. 12kg
3. 15kg
4. 20kg
0. Back`;
        }
        break;

      case 'check_order':
        if (lastInput !== '0') {
          try {
            const orderResponse = await axios.get(
              `${API_BASE_URL}/orders/${lastInput}`,
              {
                headers: {
                  Authorization: `Bearer ${session.data.token}`,
                },
              }
            );
            const order = orderResponse.data;
            response = `END Order Status:
${order.status}
Amount: ${order.totalAmount} FCFA
Thank you!`;
          } catch (error) {
            response = 'END Order not found.';
          }
          sessions.delete(sessionId);
        } else {
          session.step = 'main';
          response = `CON Welcome to GAZIGO
1. Place Order
2. Check Order Status
3. My Account
0. Exit`;
        }
        break;

      default:
        response = 'END Invalid option.';
        sessions.delete(sessionId);
    }
  }

  sessions.set(sessionId, session);
  res.set('Content-Type', 'text/plain');
  res.send(response);
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`📱 USSD Service running on port ${PORT}`);
});

