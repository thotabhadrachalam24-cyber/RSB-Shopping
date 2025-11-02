import axios from 'axios';
import { initializeRazorpay } from '@razorpay/razorpay-react-native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.apiUrl;
const RAZORPAY_KEY_ID = Constants.expoConfig.extra.razorpayKeyId;

export const initPayment = async (amount, user, onSuccess) => {
  try {
    // Initialize Razorpay
    const razorpay = await initializeRazorpay();

    // Create order on backend
    const { data } = await axios.post(`${API_URL}/api/payments/razorpay/create-order`, {
      amount // Should be in paise
    });

    // Razorpay options
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: 'INR',
      name: 'RSB Shopping',
      description: 'Payment for your order',
      order_id: data.order.id,
      prefill: {
        name: user.name,
        contact: user.phone,
        email: user.email
      },
      theme: { color: '#0284c7' }
    };

    // Open Razorpay
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await razorpay.open(
      options
    );

    // Verify payment
    const verificationResponse = await axios.post(
      `${API_URL}/api/payments/razorpay/verify`,
      {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      }
    );

    if (verificationResponse.data.success) {
      onSuccess?.({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const formatToINR = (amountInPaise) => {
  const amount = amountInPaise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};